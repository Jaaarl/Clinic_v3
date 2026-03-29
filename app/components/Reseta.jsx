import Head from "next/head";
import { FaPrescription } from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function Reseta({
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
  const router = useRouter();
  return (
    <div className="pt-1 px-4 max-w-md mx-auto font-sans">
      <Head>
        <title>Prescription</title>
        <meta name="description" content="Prescription page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <span className="text-[9px]">
          <div>
            <h1 className="mt-2 font-bold text-center">
              GUBAT MOM'S & KIDS CLINIC
            </h1>
            <h2 className="text-center">Manook St. Gubat, Sorsogon</h2>
            <h3 className="font-bold text-center underline">CLINIC HOURS:</h3>
            <h4 className=" text-center">MWF 9:00AM - 4:00PM</h4>
            <h4 className=" text-center mb-1">TThS 1:00PM - 4:00PM</h4>
          </div>
          <div className="text-[9px]">
            <h1 className="font-bold text-center">
              METRO HEALTH SPECIALISTS HOSPITAL, INC
            </h1>
            <h2 className="text-center">Brgy, Cabid-an, Sorsogon City</h2>
            <h3 className="font-bold text-center underline">CLINIC HOURS:</h3>
            <h4 className=" text-center mb-2">TThS 9:00AM - 12:00NN</h4>
          </div>
        </span>
        <div className="space-y-2 text-[9px]">
          <section className="text-[9px]">
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
          <FaPrescription size={27} />
          <section className="text-[11px]">
            <p style={{ whiteSpace: "pre-wrap" }}>{reqs}</p>
          </section>
          <div className="flex">
            <div className="mt-auto pt-1 ml-auto font-bold text-[10px]">
              <p className="font-bold"> {docName}</p>
              <p>
                <strong>Lic. #:</strong> {lic}
              </p>
              <p>
                <strong>PTR No.:</strong> {ptr}
              </p>
              <p>
                <strong>S2 Lic#:</strong> {s2}
              </p>
            </div>
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
