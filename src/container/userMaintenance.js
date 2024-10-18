import React from 'react';


const UnderMaintenance = () => {

    return (
        <>
            <div className="flex h-screen flex-col bg-white pt-16 pb-12">
                <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
                    <div className="py-16">
                        <div className="text-center">
                            <p className="text-base font-semibold text-shoorah-primary">Maintenance</p>
                            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                We'll be back soon!
                            </h1>
                            <p className="mt-2 text-base text-gray-500">
                                Sorry for the inconvenience but we're performing some maintenance at the moment.
                                We'll be back online shortly!
                            </p>

                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default UnderMaintenance;
