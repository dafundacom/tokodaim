import createTripayConfig from "@/lib/sdk/tripay"

export const tripay = createTripayConfig({
  apiKey:
    import.meta.env.APP_ENV === "development"
      ? import.meta.env.TRIPAY_API_KEY_DEV!
      : import.meta.env.TRIPAY_API_KEY_PROD!,
  privateKey:
    import.meta.env.APP_ENV === "development"
      ? import.meta.env.TRIPAY_PRIVATE_KEY_DEV!
      : import.meta.env.TRIPAY_PRIVATE_KEY_PROD!,
  merchant_code:
    import.meta.env.APP_ENV === "development"
      ? import.meta.env.TRIPAY_MERCHANT_CODE_DEV!
      : import.meta.env.TRIPAY_MERCHANT_CODE_PROD!,
  isProduction: import.meta.env.APP_ENV === "development" ? false : true,
})
