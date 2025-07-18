'use client';

import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  }

  const PlaceOrderButtom = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{' '} Place Order
      </Button>
    )
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <PlaceOrderButtom />
    </form>
  );
}

export default PlaceOrderForm;