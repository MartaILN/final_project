export function Footer() {
    return (
  <footer className="w-full bg-gray-100 py-4 pb-[-2px] mt-auto shadow-inner">
        <nav className="flex justify-end gap-[20px] pr-[100px] items-center">
          <div className="flex gap-[20px] items-center">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-600 active:text-gray-600 focus:text-gray-600 visited:text-gray-600 border border-[#f5ecd7] focus:border-[#f5ecd7] active:border-[#f5ecd7] rounded-[8px] bg-transparent focus:bg-transparent active:bg-transparent flex items-center justify-center" style={{ width: '36px', height: '36px', padding: '0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><title>Facebook</title><path d="M24 12a12 12 0 1 0-13.875 11.875v-8.406h-2.797V12h2.797V9.797c0-2.762 1.643-4.297 4.156-4.297 1.203 0 2.463.215 2.463.215v2.703h-1.388c-1.366 0-1.797.85-1.797 1.722V12h3.063l-.49 3.469h-2.573v8.406A12.004 12.004 0 0 0 24 12z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="border border-[#f5ecd7] focus:border-[#f5ecd7] active:border-[#f5ecd7] rounded-[8px] bg-transparent focus:bg-transparent active:bg-transparent flex items-center justify-center" style={{ width: '36px', height: '36px', padding: '0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 448 512">
                <defs>
                  <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%" fx="30%" fy="107%">
                    <stop offset="0%" stopColor="#fdf497"/>
                    <stop offset="5%" stopColor="#fdf497"/>
                    <stop offset="45%" stopColor="#fd5949"/>
                    <stop offset="60%" stopColor="#d6249f"/>
                    <stop offset="90%" stopColor="#285AEB"/>
                  </radialGradient>
                </defs>
                <path fill="url(#ig-gradient)" d="M224.1 141c-63.6 0-115 51.4-115 115s51.4 115 115 115 115-51.4 115-115-51.4-115-115-115zm0 190c-41.6 0-75-33.4-75-75s33.4-75 75-75 75 33.4 75 75-33.4 75-75 75zm146.4-194.3c0 14.9-12.1 27-27 27-14.9 0-27-12.1-27-27s12.1-27 27-27 27 12.1 27 27zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.9S388.6 24.6 353.3 22.9c-35.3-1.7-141.3-1.7-176.6 0-35.3 1.7-66.7 9.9-92.9 36.2S24.6 123.4 22.9 158.7c-1.7 35.3-1.7 141.3 0 176.6 1.7 35.3 9.9 66.7 36.2 92.9s57.6 34.5 92.9 36.2c35.3 1.7 141.3 1.7 176.6 0 35.3-1.7 66.7-9.9 92.9-36.2s34.5-57.6 36.2-92.9c1.7-35.3 1.7-141.3 0-176.6zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.5 11.7-99.5 9-132.3 9s-102.7 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.5-9-99.5-9-132.3s-2.6-102.7 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5 29.5-11.7 99.5-9 132.3-9s102.7-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.5 9 99.5 9 132.3s2.7 102.7-9 132.3z"/>
              </svg>
            </a>
          </div>
          <a href="#" className="text-[#f5ecd7] hover:text-[#f5ecd7] no-underline">Contact Us</a>
        </nav>
      </footer>
  );
}