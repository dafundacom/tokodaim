"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TransactionList = () => {
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const dummyTransactions = [
    {
      id: "1",
      date: "29 May 2024 - 20:53",
      status: "BELUM DIBAYAR",
      category: "Honor of Kings",
      items: "240 + 17 Tokens",
      orderId: "#P1716990784115244",
      timeLeft: "00:27:04",
      total: "Rp40.500",
    },
    {
      id: "12",
      date: "29 May 2024 - 20:53",
      status: "BELUM DIBAYAR",
      category: "Honor of Kings",
      items: "240 + 17 Tokens",
      orderId: "#P1716990784115244",
      timeLeft: "00:27:04",
      total: "Rp40.500",
    },
  ]

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value)
  }

  const filteredTransactions = dummyTransactions.filter(
    (transaction) =>
      (!statusFilter || transaction.status === statusFilter) &&
      (!dateFilter || transaction.date.includes(dateFilter)),
  )

  return (
    <div
      className="authenticated-layout lg-container mt-4 md:mt-10"
      data-testid="authenticated-layout"
    >
      <section
        data-testid="lgtransactionlistpage"
        className="transaction-list-page"
      >
        <div className="mb-[14px] items-center justify-between md:mb-6 lg:flex">
          <h2 className="mb-[14px] text-base font-bold md:text-2xl lg:mb-0">
            Daftar Transaksi
          </h2>
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full bg-primary">
                  Semua Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("BELUM DIBAYAR")}
                >
                  BELUM DIBAYAR
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilterChange("BELUM DIBAYAR")}
                >
                  SUDAH DIBAYAR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add date picker component here */}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} {...transaction} />
          ))}
        </div>
      </section>
    </div>
  )
}

const TransactionItem = ({
  id,
  date,
  status,
  category,
  items,
  orderId,
  timeLeft,
  total,
}) => {
  return (
    <div className="mb-3 last:mb-0 md:mb-5">
      <a
        className="flex h-full w-full cursor-pointer flex-col rounded-[20px] bg-background p-4 shadow-lg active:opacity-30 md:p-5"
        href={`/id-id/payment/page?tid=${id}&trx_hash=665733407fd4c`}
      >
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="text-xs md:text-sm">{date}</div>
          <div className="MuiChip-root MuiChip-outlined MuiChip-sizeSmall MuiChip-colorDefault MuiChip-outlinedDefault h-8 px-[10px] text-xs font-bold md:text-sm">
            <span className="MuiChip-label">{status}</span>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="flex items-center">
            <div className="relative mr-4 h-[40px] w-[40px] flex-grow md:h-[60px] md:w-[60px]">
              <img
                alt="Game Icon"
                src={`https://www.lapakgaming.com/static/images/category/${category}.webp?w=640&q=75`}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-initial flex-col">
              <div className="text-sm lg:text-base">{category}</div>
              <div className="text-xs font-bold lg:text-sm">{items}</div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div className="text-xs md:text-sm">{orderId}</div>
            <div className="text-right">
              <div className="text-xs md:text-sm">
                Bayar dalam{" "}
                <span className="text-sm md:text-base">{timeLeft}</span>
              </div>
              <div className="text-base font-bold md:text-xl">{total}</div>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default TransactionList
