<ul class="w-full h-full relative flex flex-col overflow-y-auto gap-4">
    <slot></slot>
</ul>

<style>
    /* Ocultar scrollbar para Chrome, Safari y Opera */
    ul::-webkit-scrollbar {
        display: none;
    }

    /* Ocultar scrollbar para IE, Edge y Firefox */
    ul {
        -ms-overflow-style: none; /* IE y Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
