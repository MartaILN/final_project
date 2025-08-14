export default function Home() {
	return (
			<div
				className="flex flex-col items-center justify-center min-h-[60vh] py-12"
				style={{
					backgroundImage: "url('/mountain.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
			<h2 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h2>
			<p className="text-lg text-gray-600">This is your main dashboard. Enjoy your stay!</p>
		</div>
	);
}
