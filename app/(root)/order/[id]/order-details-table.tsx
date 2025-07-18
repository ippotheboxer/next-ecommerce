'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js'
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  deliverOrder
} from "@/lib/actions/order.actions";
import { toast } from "sonner";

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean
}) => {
  const {
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
    id
  } = order;

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';

    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error loading paypal';
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast.error(res.message);
    }

    return res.data;
  }

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() => startTransition(async () => {
          const res = await updateOrderToPaidCOD(order.id);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })}
      >
        {isPending ? 'Processing...' : 'Mark as Paid'}
      </Button>
    )
  }

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() => startTransition(async () => {
          const res = await deliverOrder(order.id);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
        })}
      >
        {isPending ? 'Processing...' : 'Mark as Delivered'}
      </Button>
    )
  }

  return (<>
    <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>
    <div className="grid md:grid-cols-3 md:gap-5">
      <div className="col-span-2 space-y-4 overflow-x-auto">
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Payment Method</h2>
            <p className="mb-2">{paymentMethod}</p>
            {isPaid ? (
              <Badge variant='secondary'>
                Paid at {formatDateTime(paidAt!).dateTime}
              </Badge>
            ) : (
              <Badge variant='destructive'>
                Not paid
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Shipping Address</h2>
            <p>{shippingAddress.fullName}</p>
            <p className="mb-2">{shippingAddress.streetAddress}, {shippingAddress.city}</p>
            <p>{shippingAddress.postalCode}, {shippingAddress.country}</p>
            {isDelivered ? (
              <Badge variant='secondary'>
                Delivered at {formatDateTime(deliveredAt!).dateTime}
              </Badge>
            ) : (
              <Badge variant='destructive'>
                Not delivered
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 gap-4">
            <h2 className="text-xl pb-4">Order Items</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderitems.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link href={`/product/${item.slug}`} className="flex items-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2">{item.qty}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardContent className="p-4 gap-4 space-y-4">
            <div className="flex justify-between">
              <div>Items</div>
              <div>{formatCurrency(itemsPrice)}</div>
            </div>
            <div className="flex justify-between">
              <div>Tax</div>
              <div>{formatCurrency(taxPrice)}</div>
            </div>
            <div className="flex justify-between">
              <div>Shipping</div>
              <div>{formatCurrency(shippingPrice)}</div>
            </div>
            <div className="flex justify-between">
              <div>Total</div>
              <div>{formatCurrency(totalPrice)}</div>
            </div>
            {/* Paypal Payment */}
            {!isPaid && paymentMethod === 'PayPal' && (
              <div>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder} />
                </PayPalScriptProvider>
              </div>
            )}
            {/* Cash On delivery */}
            {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
              <MarkAsPaidButton />
            )
            }
            {isAdmin && isPaid && !isDelivered && (
              <MarkAsDeliveredButton />
            )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  </>);
}

export default OrderDetailsTable;