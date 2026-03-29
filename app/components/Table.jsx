import React from 'react'

export default function Table() {
    const Table = ({ data }) => {
        return (
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-300">ID</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-300">Name</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-300">Age</th>
                            <th className="px-4 py-2 bg-gray-100 border border-gray-300">Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id}>
                                <td className="px-4 py-2 border border-gray-300">{row.id}</td>
                                <td className="px-4 py-2 border border-gray-300">{row.name}</td>
                                <td className="px-4 py-2 border border-gray-300">{row.age}</td>
                                <td className="px-4 py-2 border border-gray-300">{row.gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
}
