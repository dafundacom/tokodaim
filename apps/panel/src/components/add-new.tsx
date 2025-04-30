import * as React from "react"
import NextLink from "next/link"
import { useI18n } from "@tokodaim/locales/client"
import { Button } from "@tokodaim/ui"
import { Icon } from "@yopem-ui/react-icons"

interface AddNewProps {
  title: string
  url: string
}

const AddNew: React.FC<AddNewProps> = (props) => {
  const { title, url } = props

  const t = useI18n()

  return (
    <div className="mb-8 flex justify-between">
      <h1 className="text-xl font-bold md:text-3xl">{title}</h1>
      <Button variant="ghost" asChild>
        <NextLink aria-label={t("add_new")} href={url}>
          <Icon name="Plus" className="mr-2" />
          {t("add_new")}
        </NextLink>
      </Button>
    </div>
  )
}

export default AddNew
