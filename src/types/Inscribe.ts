import { number } from "yup"

export type ContentProtocol = null | 'c-brc-20' | 'c-brc-420'

export interface InscribeForm {
  loading: boolean,
  type: ContentProtocol,
  form: null | CBrc20,
  orders: Order[],
}

export interface CBrc20 {
    tick: string,
    totalSupply: number,
    limitPerMint: number,
    chain: string,
    contract: string,
    toAddress: string,
    feeRate: number,
}

export interface Chain {
  coinType: number,
  name: string,
}

export interface Order {
  id: string,
  insId: string,
  status: string,
  content: string,
  failedReason: string,
}
