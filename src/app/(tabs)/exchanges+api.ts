import { APIResponse, Currency, MoneyState } from "@/types/moneyStateTypes";
import { StatusError } from "expo-server";

const raise = (msg:string) => {
    throw new StatusError(400, msg)
}

class CurrencyStatus {
    base_url: string;
    constructor(base_url: string) {
        this.base_url = base_url
    }
    async #callAPI (endpoint: string) {
        const req_url = this.base_url + endpoint
        const res = await fetch(req_url)
        if (!res.ok)
            throw new StatusError(404, "Error fetching the exchange rates.")
        const body: APIResponse = await res.json()
        return body.promedio
    }

    oficialDollar = async () =>  await this.#callAPI("/dolares/oficial")
    parallelDollar = async () =>  await this.#callAPI("/dolares/paralelo")
    oficialEuro = async () =>  await this.#callAPI("/euros/oficial")
    parallelEuro = async () =>  await this.#callAPI("/euros/paralelo")
}

export async function POST(request: Request) {
    const currency: Currency = await request.text() as Currency
    const BASE_URL = process.env.BASE_EXCHANGE_URL

    if (!BASE_URL) {
        throw new StatusError(
            400, "Something went wrong when calling the exchanges API."
        )
    }
        

    const status = new CurrencyStatus(BASE_URL)

    const VESresult: MoneyState = {
        USD: await status.oficialDollar(),
        EUR: await status.oficialEuro(),
        VES: 1,
        USD_P: await status.parallelDollar(),
        EUR_P: await status.parallelEuro()
    }

    if (currency === "VES") {
        return Response.json(VESresult)
    }
        

    const result: MoneyState = {
        USD: VESresult.USD / VESresult[currency],
        EUR: VESresult.EUR / VESresult[currency],
        VES: VESresult.VES / VESresult[currency],
        USD_P: VESresult.USD_P / VESresult[currency],
        EUR_P: VESresult.EUR_P / VESresult[currency]
    }

    console.log("RESULT", result)

    return Response.json(result)
}