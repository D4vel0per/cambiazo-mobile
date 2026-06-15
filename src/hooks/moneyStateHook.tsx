import { Currency, MoneyState } from "@/types/moneyStateTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

class Store {
    async setLastState(state: MoneyState) {
        const json = JSON.stringify(state)
        await AsyncStorage.setItem("lastState", json)
    }

    async getLastState() {
        const json = await AsyncStorage.getItem("lastState")
        if (!json) return null

        const data: MoneyState = JSON.parse(json)
        return data
    }
}

const store = new Store()

function sleep (seconds: number) {
    return new Promise<null>((res) => {
        const timeout = setTimeout(() => {
            res(null)
            clearTimeout(timeout)
        }, seconds * 1000)
    })
}

export function useMoneyState (initialCurrency: Currency): [boolean, MoneyState, React.Dispatch<Currency>] {
    let [ moneyState, setMoneyState ] = useState<MoneyState>({
        VES: 1,
        EUR: 1,
        USD: 1,
        USD_P: 1,
        EUR_P: 1
    })

    let [ currentCurrency, setCurrentCurrency ] = useState<Currency>(initialCurrency)
    let [ isResolved, setIsResolved ] = useState<boolean>(false)

    useEffect(() => {(async () => {
        const previousState = await store.getLastState()

        let state: Response = await fetch("/exchanges", {
            method: "POST",
            body: currentCurrency
        })

        if (previousState) setMoneyState(previousState)

        if (!state.ok) {
            let fetched = false;

            for (let i = 1; i <= 5; i++) {
                await sleep(i * 2)
                state = await fetch("/exchanges", {
                    method: "POST",
                    body: currentCurrency
                })
                if (state.ok) {
                    fetched = true;
                    break;
                }
            }

            if (!fetched) {
                setIsResolved(true)
                return
            }
        }

        const result: MoneyState = await state.json()

        await store.setLastState(result)

        setMoneyState(result)
        setIsResolved(true)
    })()}, [])

    useEffect(() => {(async () => {
        setMoneyState(state => {
            let newState: MoneyState = { ...state }
            for (let k in state) {
                const currency = k as Currency
                newState[currency] = state[currency] / state[currentCurrency]
            }
            return newState
        })
    })()}, [ currentCurrency ])

    return [ isResolved, moneyState, setCurrentCurrency ]
}