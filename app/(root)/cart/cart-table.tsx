'use client';
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Cart } from "@/types";
import Link from "next/link";
import Image from "next/image";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {

    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${item.name} added to cart`, {
      action: {
        label: "Go to Cart",
        onClick: () => router.push("/cart"),
      },
    });
  }

  return (
    <>
      <h1 className="py-4 h2-bold">
        Shopping Cart
      </h1>
      {!cart || cart.items === 0 ? (
        <div>
          Cart is empty. <Link href='/'>Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-col-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">Table</div>
        </div>
      )}
    </>
  )
}

export default CartTable;