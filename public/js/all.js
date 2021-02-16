const deleteBtn = document.querySelectorAll(".delete");
const showMore = document.querySelectorAll(".show-more");


showMore.forEach((showMoreBtn) => {
	showMoreBtn.addEventListener("click", async (e) => {
		const baseURL = `/survey/id/${showMoreBtn.getAttribute('data-id')}?admin=true`;
		// console.log(deleteButton.getAttribute('data-id'));
		const data = await fetch(baseURL, { method: 'GET' })
		const da = await data.text();
		window.location = baseURL;
		console.log(da);
	});
});

deleteBtn.forEach((deleteButton) => {
	deleteButton.addEventListener("click", async (e) => {
		const baseURL = `/delete/survey/id/${deleteButton.getAttribute('data-id')}`;
		// Prompt
		const allowDelete = confirm("Do you really want to delete?");
		// console.log(deleteButton.getAttribute('data-id'));
		if (allowDelete) {
			const data = await fetch(baseURL, { method: 'DELETE' });
			const da = await data.text();
			if (data.status === 200) {
				window.location.reload();
				showToast(da);
			} else {
				showToast("ERROR OCCURRED");
			}
		}		
	});
});

// Toast message
function showToast(message) {
	var x = document.getElementById("snackbar");
	x.className = "show";
	x.innerText = message;
	setTimeout(function () {
		x.className = x.classList.remove("show");
	}, 2700);
}
