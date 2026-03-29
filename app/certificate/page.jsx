"use client";
import { React, useState } from "react";
import Certi from "../components/Certi";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const age = searchParams.get("age");
  const sex = searchParams.get("sex");
  const date = searchParams.get("date");
  const address = searchParams.get("address");
  const req1 = searchParams.get("req1");
  const req2 = searchParams.get("req2");
  const docName = searchParams.get("docName");
  const lic = searchParams.get("lic");
  const ptr = searchParams.get("ptr");
  const s2 = searchParams.get("s2");
  function decodeTwice(encodedStr) {
    // First decode
    const firstDecode = decodeURIComponent(encodedStr);
    // Second decode
    const finalDecode = decodeURIComponent(firstDecode);
    return finalDecode;
  }
  function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();

    if (
      ageMonths < 0 ||
      (ageMonths === 0 && today.getDate() < birthDate.getDate())
    ) {
      ageYears--;
      ageMonths += 12;
    }

    if (ageYears === 0) {
      ageMonths = today.getMonth() - birthDate.getMonth();
      if (today.getDate() < birthDate.getDate()) {
        ageMonths--;
      }

      if (ageMonths === 0) {
        const ageDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        return `${ageDays} days old`;
      }

      return `${ageMonths} months old`;
    }

    return `${ageYears} years old`;
  }

  const realAge = calculateAge(decodeTwice(age));
  return (
    <>
      <div>
        <Certi
          name={decodeTwice(name)}
          age={realAge}
          gender={sex}
          date={decodeTwice(date)}
          address={decodeTwice(address)}
          req1={decodeTwice(req1)}
          req2={decodeTwice(req2)}
          docName={decodeURIComponent(docName)}
          lic={decodeURIComponent(lic)}
          ptr={decodeURIComponent(ptr)}
          s2={decodeURIComponent(s2)}
        />
      </div>
    </>
  );
}
