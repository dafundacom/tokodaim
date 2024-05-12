import crypto from "crypto"

export type PriceListType = "prepaid" | "pasca"

export type TransactoinType =
  | null
  | "inq-pasca"
  | "pay-pasca"
  | "status-pasca"
  | "pln-subscribe"

export interface DigiflazzConfigProps {
  username: string
  key: string
  webhook?: string
}

export interface DigiflazzReturnProps<T> {
  cekSaldo: () => Promise<T>
  daftarHarga: (_cmdOption: PriceListType) => Promise<T>
  deposit: (_props: DigiflazzDepositProps) => Promise<T>
  transaksi: (_props: DigiflazzTransactionProps) => Promise<T>
}

export interface DigiflazzDepositProps {
  amount: number
  bank: string
  name: string
}

export interface DigiflazzTransactionProps {
  sku: string
  customerNo: string
  refId: string
  cmd?: TransactoinType
  testing: boolean
  msg: string
  max_price?: number
  cb_url?: string
  allow_dot?: boolean
}

export interface CekSaldoReturnProps {
  data: {
    deposit: number
  }
}

export interface DaftarHargaPrePaidReturnProps {
  data: {
    product_name: string
    category: string
    brand: string
    type: string
    seller_name: string
    price: number
    buyer_sku_code: string
    buyer_product_status: boolean
    seller_product_status: boolean
    unlimited_stock: boolean
    stock: number
    multi: boolean
    start_cut_off: string
    end_cut_off: string
    desc: string
  }[]
}

export interface DaftarHargaPostPaidReturnProps {
  data: {
    product_name: string
    category: string
    brand: string
    seller_name: string
    admin: number
    commission: number
    buyer_sku_code: string
    buyer_product_status: boolean
    seller_product_status: boolean
    desc: string
  }[]
}

export interface DepositReturnProps {
  data: {
    rc: string
    amount: number
    notes: string
  }
}

export interface TransaksiReturnProps {
  data: {
    ref_id: string
    customer_no: string
    buyer_sku_code: string
    message: string
    status: string
    rc: string
    sn: string
    buyer_last_saldo: number
    price: number
    tele: string
    wa: string
  }
}

export default function createDigiflazzConfig({
  username,
  key,
}: DigiflazzConfigProps): DigiflazzReturnProps<unknown> {
  const endpoint = "https://api.digiflazz.com/v1"

  const cekSaldo = async () => {
    const payload = {
      cmd: "deposit",
      username,
      sign: crypto
        .createHash("md5")
        .update(`${username}${key}depo`)
        .digest("hex"),
    }

    try {
      const response = await fetch(`${endpoint}/cek-saldo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  const daftarHarga = async (cmdOption: PriceListType) => {
    const payload = {
      cmd: cmdOption,
      username,
      sign: crypto
        .createHash("md5")
        .update(`${username}${key}pricelist`)
        .digest("hex"),
    }

    try {
      const response = await fetch(`${endpoint}/price-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  const deposit = async ({ amount, bank, name }: DigiflazzDepositProps) => {
    const payload = {
      username,
      amount,
      Bank: bank,
      owner_name: name,
      sign: crypto
        .createHash("md5")
        .update(`${username}${key}deposit`)
        .digest("hex"),
    }

    try {
      const response = await fetch(`${endpoint}/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  const transaksi = async ({
    sku,
    customerNo,
    refId,
    cmd = null,
    testing,
    msg,
    max_price,
    cb_url,
    allow_dot,
  }: DigiflazzTransactionProps) => {
    const payload = {
      username,
      buyer_sku_code: sku,
      customer_no: customerNo,
      ref_id: refId,
      testing,
      msg,
      ...(cmd && { commands: cmd }),
      ...(max_price && { max_price: max_price }),
      ...(cb_url && { cb_url: cb_url }),
      ...(allow_dot && { allow_dot: allow_dot }),
      sign: crypto
        .createHash("md5")
        .update(`${username}${key}${refId}`)
        .digest("hex"),
    }

    try {
      const response = await fetch(`${endpoint}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.log(error)
      throw new Error("Something went wrong")
    }
  }

  return {
    cekSaldo,
    daftarHarga,
    deposit,
    transaksi,
  }
}
