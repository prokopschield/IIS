<script lang="ts">
	export let info: any;

	function calculateAttendeePoints(attendee_id: number) {
		return (
			Math.round(
				info.camp.activity
					.map((activity: any) => {
						const attended = activity.attended.find(
							(attended: { attendee_id: number }) =>
								attended.attendee_id === attendee_id,
						);

						return attended ? attended.score : 0;
					})
					.reduce((score: number, previous: number) => {
						return (score || 0) + (previous || 0);
					}) * 100,
			) / 100
		);
	}
</script>

<h2>Účastníci:</h2>
<table>
	<tr>
		<th>Jméno</th>
		<th>Přezdívka</th>
		<th>Body</th>
		<th>Zákonný zástupce</th>
		<th>Kontakt na zák. zástupce</th>
	</tr>
	{#each info.camp.attendee as attendee}
		<tr>
			<td>{attendee.user.legal_name}</td>
			<td>{attendee.user.displayname}</td>
			<td>
				{calculateAttendeePoints(attendee.id)}b
			</td>
			<td> {attendee.user.legal_guardian} </td>
			<td> {attendee.user.legal_guardian_contact}</td>
		</tr>
	{/each}
</table>

<style>
	td {
		padding: 0.3em;
	}
	td,
	table,
	th {
		border: 1px solid black;
	}
</style>
