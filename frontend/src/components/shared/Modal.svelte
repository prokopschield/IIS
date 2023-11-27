<script>
    export let modalId = "modal_1"; // Default value
    import Button from "./Button.svelte";

    function closeModal() {
        // Ignore error
        document.getElementById(modalId).close();
    }
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog id={modalId} class="modal">
    <div class="modal-box">

        <h3 class="font-bold text-lg">
            <!-- Title of modal will fo here-->
            <slot name="title">

            </slot>
        </h3>
        <p class="py-4">
            <!-- Content of modal will go here-->
            <slot name="content">

            </slot>
        </p>

        <div class="modal-action">

            <!-- Action Button will go here-->
            <slot name="action_buttons">

            </slot>
            <Button buttonClass="btn btn-ghost" on:click={closeModal}>Close</Button>
        </div>
    </div>
</dialog>