
import { Currency, MoneyState } from "@/types/moneyStateTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

class Store {
    store = AsyncStorage;

    async setLastState(state: MoneyState) {
        const json = JSON.stringify(state)
        await this.store.setItem("lastState", json)
    }

    async getLastState() {
        const json = await this.store.getItem("lastState")
        if (!json) return null

        const data: MoneyState = JSON.parse(json)
        return data
    }
}

const store = new Store()

export function useMoneyState (initialCurrency: Currency): [MoneyState, React.Dispatch<Currency>] {
    let [ moneyState, setMoneyState ] = useState<MoneyState>({
        VES: 0,
        EUR: 0,
        USD: 0,
        USD_P: 0,
        EUR_P: 0
    })

    let [ currentCurrency, setCurrentCurrency ] = useState<Currency>(initialCurrency)

    useEffect(() => {(async () => {
        const previousState = await store.getLastState()

        const state: Response = await fetch("/exchanges", {
            method: "POST",
            body: currentCurrency
        })

        if (!state.ok && previousState) {
            setMoneyState(previousState)
            return
        } else if (!state.ok) return

        const result: MoneyState = await state.json()

        setMoneyState(result)
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

    return [ moneyState, setCurrentCurrency ]
}