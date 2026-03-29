import React from "react";

export default function LabReqForm({
  reqs,
  name,
  age,
  gender,
  address,
  date,
  docName,
  lic,
  ptr,
  s2,
}) {
  return (
    <div className="p-4 max-w-md mx-auto font-sans">
      <main>
        <h1 className="text-xs font-bold text-center">
          CLINIC_NAME
        </h1>
        <h2 className="text-xs text-center">CLINIC_ADDRESS</h2>

        <h4 className="text-xs text-center font-bold">
          Laboratory Request Form
        </h4>
        <div className="space-y-2">
          <section className="text-xs">
            <div className="flex justify-between">
              <p>
                <strong>Patient:</strong> {name}
              </p>
              <div className="flex gap-1">
                <p>
                  <strong>Age:</strong> {age}
                </p>
                <p>
                  <strong>Sex:</strong> {gender}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Address:</strong> {address}
              </p>
              <p>
                <strong>Date:</strong> {date}
              </p>
            </div>
          </section>

          <div className="border-t border-black pt-2 h-0.5"></div>

          <section className="text-[12px] mb-1">
            <p>
              <strong>Request For:</strong>{" "}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{reqs}</p>
          </section>
          <div className="flex text-[10px]">
            <section className="pt-1 pb-3 mt-auto ml-auto">
              <p className="font-bold"> {docName}</p>
              <p>
                <strong>Lic. #:</strong> {lic}
              </p>
              <p>
                <strong>PTR No.:</strong> {ptr}
              </p>
            </section>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media print {
          .container {
            width: 100%;
            margin: 0;
            padding: 0;
            font-size: 12pt;
          }
        }
      `}</style>
    </div>
  );
}
