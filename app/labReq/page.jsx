"use client";
import React from "react";
import LabReqForm from "../components/LabReqForm";
import { useSearchParams } from "next/navigation";
import { calculateAge } from "@/lib/utils/dateUtils";

function decodeTwice(encodedStr) {
  if (!encodedStr) return "";
  const firstDecode = decodeURIComponent(encodedStr);
  const finalDecode = decodeURIComponent(firstDecode);
  return finalDecode;
}

export default function Page() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const age = searchParams.get("age");
  const sex = searchParams.get("sex");
  const date = searchParams.get("date");
  const address = searchParams.get("address");
  const req = searchParams.get("req");
  const docName = searchParams.get("docName");
  const lic = searchParams.get("lic");
  const ptr = searchParams.get("ptr");
  const s2 = searchParams.get("s2");

  const realAge = calculateAge(decodeTwice(age));
  return (
    <>
      <LabReqForm
        name={decodeTwice(name)}
        age={realAge}
        gender={sex}
        date={date}
        address={decodeTwice(address)}
        reqs={decodeTwice(req)}
        docName={decodeURIComponent(docName)}
        lic={decodeURIComponent(lic)}
        ptr={decodeURIComponent(ptr)}
        s2={decodeURIComponent(s2)}
      />
    </>
  );
}
