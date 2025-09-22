<script lang="ts">
    import ProductForm from "$lib/components/product-form.svelte";
    import Breadcrumb from "$lib/components/breadcrumb.svelte";
    import { goto } from "$app/navigation";
    import HouseSimple from "phosphor-svelte/lib/HouseSimple";
    import Package from "phosphor-svelte/lib/Package";

    let { data } = $props();

    const handleCancel = () => {
        goto("/products");
    };

    const breadcrumbItems = [
        { label: "Dashboard", href: "/", icon: HouseSimple },
        { label: "Products", href: "/products", icon: Package },
        {
            label: data.product ? data.product.name : "New Product",
            href: `#`,
            icon: undefined
        }
    ];
</script>

<div class="container mx-auto px-4 py-6">
    <Breadcrumb items={breadcrumbItems} />

    <div class="bg-background-alt rounded-2xl shadow-inner border border-border-card overflow-hidden">
        <div class="p-6 border-b border-border-card">
            <h1 class="text-2xl font-semibold ">
                {data.product ? 'Edit Product' : 'Create Product'}
            </h1>
            <p class="text-sm text-foreground-alt mt-1">
                {data.product ? 'Update product details and settings' : 'Add a new product to your inventory'}
            </p>
        </div>

        <ProductForm
            formData={data.productForm}
            product={data.product}
            isModal={false}
            onClose={handleCancel}
        />
    </div>
</div>