export function InkubatorLogo() {
    return (
        <div className="flex flex-col items-center gap-6">
            {/* UNIKOM Logo */}
            <div className="flex items-center justify-center">
                <img
                    src="/unikom-logo.png"
                    alt="UNIKOM Logo"
                    className="h-24 w-auto"
                />
            </div>

            {/* Title */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Login Inkubator</h1>
                <p className="mt-2 text-sm text-gray-600 max-w-xs">
                    Masuk untuk melanjutkan proses pendaftaran dan pengelolaan startup.
                </p>
            </div>
        </div>
    );
}
