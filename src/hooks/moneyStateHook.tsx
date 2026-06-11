
import { Currency, MoneyState } from "@/types/moneyStateTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

class Store {
    store;

    constructor (storeName: string) {
        this.store = AsyncStorage
    }

    getCurrentDate ()  {
        const currentDate = new Date(Date.now())
        const [ year, month, day ] = [ 
            currentDate.getFullYear(), 
            currentDate.getMonth() , 
            currentDate.getDate()
        ]
        const formattedDate = new Date(year, month, day)
        return formattedDate
    }
    async getLastDate () {
        const lastDate = await this.store.getItem("lastDate")
        return lastDate ? new Date(lastDate) : null
    }
    async setLastDate (date: Date) {
        return await this.store.setItem("lastDate", date.toISOString())
    }

    async getMoneyState () {
        const jsonData = await this.store.getItem("moneyState")

        if (jsonData) {
            const data: MoneyState = JSON.parse(jsonData)
            return data
        }
        return null
    }

    async updateMoneyState (moneyState: MoneyState) {
        const jsonData = JSON.stringify(moneyState)
        await this.store.setItem("moneyState", jsonData)
    }
}

const store = new Store("MoneyStates")

const timeTilNextDay = () => {
    const currentTime = new Date(Date.now())
    const nextDay = new Date(
        currentTime.getFullYear(), 
        currentTime.getMonth(),
        currentTime.getDate() + 1
    )
    return nextDay.getTime() - Date.now()
}

export function useMoneyState (initialCurrency: Currency): [MoneyState, React.Dispatch<Currency>] {
    let [ shouldUpdate, setShouldUpdate ] = useState<boolean>(true)
    let [ moneyState, setMoneyState ] = useState<MoneyState>({
        VES: 0,
        EUR: 0,
        USD: 0,
        USD_P: 0,
        EUR_P: 0
    })

    let [ currentCurrency, setCurrentCurrency ] = useState<Currency>(initialCurrency)

    useEffect(() => {(async () => {
        const currentDate = store.getCurrentDate()
        const lastDate = await store.getLastDate()

        if (lastDate && currentDate > lastDate) {
            setShouldUpdate(true)
            await store.setLastDate(currentDate)
        } else if (lastDate) {
            setShouldUpdate(false)
        } else {
            setShouldUpdate(true)
            await store.setLastDate(currentDate)
        }

        const previousState = await store.getMoneyState()
        if (previousState)
            setMoneyState(previousState)

        let updateInterval: number;
        
        updateInterval = setInterval(() => {
            setShouldUpdate(true)
        }, 6 * 60 * 60 * 1000)

        return () => { 
            clearInterval(updateInterval)
        }

    })()}, [])

    useEffect(() => {(async () => {
        if (!shouldUpdate) {
            setMoneyState(state => {
                let newState: MoneyState = { ...state }
                for (let k in state) {
                    const currency = k as Currency
                    newState[currency] = state[currency] / state[currentCurrency]
                }
                return newState
            })

            return 
        }

        const state: Response = await fetch("/exchanges", {
            method: "POST",
            body: currentCurrency
        })

        if (!state.ok) return

        const result: MoneyState = await state.json()

        setMoneyState(result)
        setShouldUpdate(false)
    })()}, [ shouldUpdate, currentCurrency ])

    return [ moneyState, setCurrentCurrency ]
}