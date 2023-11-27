<script>

import Button from "./Button.svelte";

</script>

<dialog id="my_modal_1" class="modal">
	<div class="modal-box">
		<slot>
			<!-- Passed text will go in here -->
		</slot>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<Button buttonClass="btn">Close</Button>
			</form>
		</div>
	</div>
</dialog>