// CertificatesSection.jsx
// Medical certificate management

export default function CertificatesSection({ certificates, onAddCertificate, onRemoveCertificate, onCertificateChange }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Medical Certificates</h3>
        <button type="button" onClick={onAddCertificate}
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded focus:outline-none focus:shadow-outline">Add Certificate</button>
      </div>
      {certificates.map((cert, index) => (
        <div key={index} className="border rounded p-3 mb-2">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium">Certificate {index + 1}</span>
            {certificates.length > 1 && (
              <button type="button" onClick={() => onRemoveCertificate(index)} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
            )}
          </div>
          <textarea value={cert.diagnosis} onChange={(e) => onCertificateChange(index, "diagnosis", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm mb-2" rows="2" placeholder="Diagnosis" />
          <textarea value={cert.recommendation} onChange={(e) => onCertificateChange(index, "recommendation", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm" rows="2" placeholder="Recommendation" />
        </div>
      ))}
    </div>
  );
}
