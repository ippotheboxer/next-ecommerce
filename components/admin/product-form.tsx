'use client';

import { productDefaultValues } from "@/lib/constants";
import { insertProductsSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";

const ProductForm = ({ type, product, productId }: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductsSchema>>({
    resolver: type === 'Update'
      ? zodResolver(updateProductSchema)
      : zodResolver(insertProductsSchema),
    defaultValues: product && type === 'Update' ? product : productDefaultValues,
  });

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Name */}
          {/* Slug */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Category */}
          {/* Brand */}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price */}
          {/* Stock */}
        </div>
        <div className="upload-field flex flex-col gap-5 md:flex-row">
          {/* Images */}
        </div>
        <div className="upload-field">
          {/* isFeatured */}
        </div>
        <div>
          {/* Description */}
        </div>
        <div>
          {/* Submit */}
        </div>
      </form>
    </Form>
  );
}

export default ProductForm;