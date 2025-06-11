"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { CustomerData, CustomerUpsertDTO } from "@/lib/customer-service"

// Validation schema
const formSchema = z.object({
  userName: z.string().min(1, "Họ tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  identityNumber: z.string().min(1, "CCCD/CMND là bắt buộc"),
});

interface CustomerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CustomerUpsertDTO) => void
  customer: CustomerData | null
}

export function CustomerDialog({ isOpen, onClose, onSave, customer }: CustomerDialogProps) {
  const form = useForm<CustomerUpsertDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      phone: "",
      address: "",
      identityNumber: "",
    },
  })

  useEffect(() => {
    if (customer) {
      form.reset(customer)
    } else {
      form.reset({
        userName: "",
        email: "",
        phone: "",
        address: "",
        identityNumber: "",
      })
    }
  }, [customer, form, isOpen])

  const onSubmit = (data: CustomerUpsertDTO) => {
    onSave(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identityNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CCCD/CMND</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789012" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường ABC, Quận XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Hủy</Button>
              </DialogClose>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 