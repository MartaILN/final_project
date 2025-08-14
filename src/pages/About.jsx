export default function About() {
	return (
		<div
			className="flex flex-col items-center justify-center min-h-[60vh] py-12"
			style={{
				backgroundImage: "url('/mountain.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<h2 className="text-3xl font-bold mb-4">About Us</h2>
			<p className="text-lg text-gray-600 max-w-xl text-center">This project was created to help you manage your trips. Built with React, Vite, Supabase, and Tailwind CSS.</p>
		</div>
	);
}
