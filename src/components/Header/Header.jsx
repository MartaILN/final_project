
import { Link } from 'react-router-dom';

export function Header({ isAuthenticated, user, onSignOut }) {
    return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-[#07689f] to-[#43c6ac] text-white py-6 px-6 rounded-b-2xl shadow-xl font-sans">
            <div className="flex flex-row items-center w-full max-w-6xl mx-auto justify-between gap-4">
                <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-lg text-left pl-[250px]" style={{ color: '#f5ecd7' }}>My Trip</h1>
                <nav className="flex items-center gap-[25px] text-lg ml-auto pr-[100px]">
                    {isAuthenticated && <Link to="/" className="border border-[#f5ecd7] border-[1.5px] rounded-[4px] px-[20px] py-[10px] flex items-center font-semibold text-[#f5ecd7] text-3xl hover:text-[#f5ecd7] transition-colors hover:bg-[#f5ecd7]/10 no-underline">Home</Link>}
                    <Link to="/about" className="border border-[#f5ecd7] border-[1.5px] rounded-[4px] px-[20px] py-[10px] flex items-center font-semibold text-[#f5ecd7] text-3xl hover:text-[#f5ecd7] transition-colors hover:bg-[#f5ecd7]/10 no-underline">About</Link>
                    {isAuthenticated ? (
                        <button
                            onClick={onSignOut}
                            className="border border-[#f5ecd7] border-[1.5px] rounded-[4px] px-[20px] py-[10px] flex items-center font-semibold text-[#f5ecd7] text-3xl bg-[#fa8072] hover:bg-[#e57373] hover:text-white transition-colors ml-4"
                            style={{ fontFamily: 'inherit', fontWeight: '600' }}
                        >Sign Out</button>
                    ) : (
                        <Link to="/sign-in" className="border border-[#f5ecd7] border-[1.5px] rounded-[4px] px-[20px] py-[10px] flex items-center font-semibold text-[#f5ecd7] text-3xl hover:text-[#f5ecd7] transition-colors hover:bg-[#f5ecd7]/10 no-underline ml-4">Sign In</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}