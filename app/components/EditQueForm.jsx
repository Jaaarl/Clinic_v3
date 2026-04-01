"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PatientInfoSection from "./edit-que-form/PatientInfoSection";
import LabRequestsSection from "./edit-que-form/LabRequestsSection";
import CertificatesSection from "./edit-que-form/CertificatesSection";
import CheckoutSection from "./edit-que-form/CheckoutSection";
import QueueManagementSection from "./edit-que-form/QueueManagementSection";

export default function EditQueForm({
  id,
  name1,
  gender1,
  contact1,
  medical_history1,
  medication1,
  birthday1,
  visit_history1,
  docName,
  lic,
  ptr,
  s2,
}) {
  const router = useRouter();

  // Parse visit history from JSON string
  let parsedHistory = [];
  try {
    if (visit_history1) {
      parsedHistory =
        typeof visit_history1 === "string"
          ? JSON.parse(visit_history1)
          : visit_history1;
    }
  } catch (e) {
    console.error("Error parsing visit history:", e);
  }

  // Parse medications from JSON string
  let parsedMedications = [];
  try {
    if (medication1) {
      parsedMedications =
        typeof medication1 === "string"
          ? JSON.parse(medication1)
          : medication1;
    }
  } catch (e) {
    console.error("Error parsing medications:", e);
  }

  // Initialize form data
  const [formData, setFormData] = useState({
    name: name1 || "",
    birthday: birthday1 || "",
    gender: gender1 || "male",
    contact: contact1 || "",
    medical_history: medical_history1 || "",
    medications: parsedMedications || [],
  });

  // Lab requests state
  const [labRequests, setLabRequests] = useState(
    parsedHistory
      .filter((v) => v.labRequest && v.labRequest.request)
      .map((v) => ({
        request: v.labRequest.request || "",
        isDone: v.labRequest.isDone || false,
      }))
  );

  // Certificates state
  const [certificates, setCertificates] = useState(
    parsedHistory
      .filter((v) => v.certificate && (v.certificate.diagnosis || v.certificate.recommendation))
      .map((v) => ({
        diagnosis: v.certificate.diagnosis || "",
        recommendation: v.certificate.recommendation || "",
      }))
  );

  // Checkout state
  const [checkout, setCheckout] = useState(() => {
    const lastCompleted = parsedHistory
      .filter((v) => v.checkout && v.checkout.date)
      .pop();
    return {
      date: lastCompleted?.checkout?.date || "",
      purpose: lastCompleted?.checkout?.purpose || "",
      notes: lastCompleted?.checkout?.notes || "",
    };
  });

  // Queue data state
  const [queueData, setQueueData] = useState({
    visit_type: parsedHistory.length > 0 ? parsedHistory[parsedHistory.length - 1].visit_type || "new" : "new",
    status: "waiting",
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState("patient");

  // Doctor state
  const [doctor, setDoctor] = useState([]);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch("/api/doctor");
        const data = await response.json();
        if (data.doctors) {
          setDoctor(data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };
    fetchDoctor();
  }, []);

  // Handlers
  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleMedicationChange = (index, value) => {
    const updated = [...formData.medications];
    updated[index] = value;
    setFormData({ ...formData, medications: updated });
  };

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, ""],
    });
  };

  const handleRemoveMedication = (index) => {
    const updated = formData.medications.filter((_, i) => i !== index);
    setFormData({ ...formData, medications: updated });
  };

  const handleAddLabRequest = () => {
    setLabRequests([...labRequests, { request: "", isDone: false }]);
  };

  const handleRemoveLabRequest = (index) => {
    setLabRequests(labRequests.filter((_, i) => i !== index));
  };

  const handleLabRequestChange = (index, value) => {
    const updated = [...labRequests];
    updated[index].request = value;
    setLabRequests(updated);
  };

  const handleLabCheckboxChange = (index, checked) => {
    const updated = [...labRequests];
    updated[index].isDone = checked;
    setLabRequests(updated);
  };

  const handleAddCertificate = () => {
    setCertificates([...certificates, { diagnosis: "", recommendation: "" }]);
  };

  const handleRemoveCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleCertificateChange = (index, field, value) => {
    const updated = [...certificates];
    updated[index][field] = value;
    setCertificates(updated);
  };

  const handleCheckoutChange = (field, value) => {
    setCheckout({ ...checkout, [field]: value });
  };

  const handleQueueChange = (field, value) => {
    setQueueData({ ...queueData, [field]: value });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty requests
    const filteredLabRequests = labRequests.filter(
      (req) => req.request && req.request.trim() !== ""
    );
    const filteredCertificates = certificates.filter(
      (cert) => (cert.diagnosis || "").trim() !== "" || (cert.recommendation || "").trim() !== ""
    );

    // Filter out empty medications
    const filteredMedications = formData.medications.filter(
      (med) => med && med.trim() !== ""
    );

    try {
      // First update patient info
      const patientResponse = await fetch(`/api/patient/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          birthday: formData.birthday,
          contact: formData.contact,
          medical_history: formData.medical_history,
          medications: filteredMedications,
        }),
      });

      if (!patientResponse.ok) {
        throw new Error("Failed to update patient");
      }

      // Then create a new visit history entry with the new data
      const newVisit = {
        visit_date: new Date().toISOString().split("T")[0],
        visit_type: queueData.visit_type,
        labRequest: filteredLabRequests.length > 0 ? filteredLabRequests : undefined,
        certificate: filteredCertificates.length > 0 ? filteredCertificates[0] : undefined,
        checkout:
          checkout.date || checkout.purpose || checkout.notes
            ? {
                date: checkout.date,
                purpose: checkout.purpose,
                notes: checkout.notes,
              }
            : undefined,
      };

      const updatedHistory = [...parsedHistory, newVisit];

      const historyResponse = await fetch(`/api/patient/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_history: updatedHistory,
        }),
      });

      if (!historyResponse.ok) {
        throw new Error("Failed to update visit history");
      }

      // Navigate back to queue
      router.push("/queue");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Decode function for URLs
  const decodeTwice = (str) => {
    if (!str) return "";
    try {
      return decodeURIComponent(decodeURIComponent(str));
    } catch (e) {
      return str;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("patient")}
            className={`px-4 py-2 ${
              activeTab === "patient"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Patient Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("visit")}
            className={`px-4 py-2 ${
              activeTab === "visit"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Visit History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2 ${
              activeTab === "queue"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Queue
          </button>
        </div>

        {/* Patient Info Tab */}
        {activeTab === "patient" && (
          <div className="bg-white shadow rounded-lg p-6 mb-4">
            <PatientInfoSection
              formData={formData}
              onInputChange={handleInputChange}
              onAddMedication={handleAddMedication}
              onRemoveMedication={handleRemoveMedication}
              onMedicationChange={handleMedicationChange}
            />
          </div>
        )}

        {/* Visit History Tab */}
        {activeTab === "visit" && (
          <div className="bg-white shadow rounded-lg p-6 mb-4">
            {/* Lab Requests */}
            <LabRequestsSection
              labRequests={labRequests}
              onAddLabRequest={handleAddLabRequest}
              onRemoveLabRequest={handleRemoveLabRequest}
              onLabRequestChange={handleLabRequestChange}
              onLabCheckboxChange={handleLabCheckboxChange}
            />

            {/* Certificates */}
            <CertificatesSection
              certificates={certificates}
              onAddCertificate={handleAddCertificate}
              onRemoveCertificate={handleRemoveCertificate}
              onCertificateChange={handleCertificateChange}
            />

            {/* Checkout */}
            <CheckoutSection
              checkout={checkout}
              onCheckoutChange={handleCheckoutChange}
            />
          </div>
        )}

        {/* Queue Tab */}
        {activeTab === "queue" && (
          <div className="bg-white shadow rounded-lg p-6 mb-4">
            <QueueManagementSection
              queueData={queueData}
              onQueueChange={handleQueueChange}
              doctor={doctor}
              doctorName={docName}
              lic={lic}
              ptr={ptr}
              s2={s2}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            href="/queue"
            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
