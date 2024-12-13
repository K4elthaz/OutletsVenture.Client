"use client";
import React, { useEffect, useState } from "react";
import { db, get, ref } from "@/utils/firebase";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"; // Importing social media icons

const Footer = () => {
  const [footerData, setFooterData] = useState<any>(null); // Store the fetched footer data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const snapshot = await get(ref(db, "Settings/Footer"));
        if (snapshot.exists()) {
          setFooterData(snapshot.val()); // Set fetched data
        } else {
          console.log("No footer data available.");
        }
      } catch (error) {
        console.error("Error fetching footer data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return <div>Loading footer...</div>;
  }

  if (!footerData) {
    return <div>Footer data not available.</div>;
  }

  return (
    <footer className="flexCenter pt-24 bg-black">
      <div className="padding-container max-container flex w-full flex-col gap-14">
        <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
          {/* First Column for Operational Hours */}
          <FooterColumn title="OPERATIONAL HOURS">
            <p className="regular-14 text-gray-30">
              <strong>OPERATIONAL HOURS:</strong>
              <br />
              {footerData.operationalHours[0].days}: {footerData.operationalHours[0].time}
              <br />
              {footerData.operationalHours[1].days}: {footerData.operationalHours[1].time}
            </p>
          </FooterColumn>

          {/* Second Column with Contact Us / Leasing */}
          <FooterColumn title="CONTACT US / LEASING">
            <ul className="regular-14 flex flex-col gap-4 text-gray-30">
              <li>
                <Link
                  href={`https://${footerData.contact.website}`}
                  className="hover:text-gray-400"
                  target="_blank"
                >
                  {footerData.contact.name}
                </Link>
              </li>
              <li>
                <Link href={`tel:${footerData.contact.mobile}`} className="hover:text-gray-400">
                  Mobile Number: {footerData.contact.mobile}
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${footerData.contact.email}`}
                  className="hover:text-gray-400"
                >
                  Email: {footerData.contact.email}
                </Link>
              </li>
            </ul>
          </FooterColumn>

          {/* Third Column with Icons and Text */}
          <FooterColumn title="FOLLOW US:">
            <ul className="regular-14 flex flex-col gap-4 text-gray-30">
              <li className="flex items-center gap-2">
                <Link
                  href={footerData.socialMedia.facebook}
                  target="_blank"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-white w-6 h-6 transition-colors hover:text-blue-500" />
                </Link>
                <Link
                  href={`https://${footerData.socialMedia.facebook}`}
                  target="_blank"
                  className="text-white hover:text-blue-500"
                >
                  {footerData.socialMedia.facebook}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link
                  href={footerData.socialMedia.instagram}
                  target="_blank"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-white w-6 h-6 transition-colors hover:text-pink-500" />
                </Link>
                <Link
                  href={`https://${footerData.socialMedia.instagram}`}
                  target="_blank"
                  className="text-white hover:text-pink-500"
                >
                  {footerData.socialMedia.instagram}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link
                  href={footerData.socialMedia.youtube}
                  target="_blank"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-white w-6 h-6 transition-colors hover:text-red-500" />
                </Link>
                <Link
                  href={`https://${footerData.socialMedia.youtube}`}
                  target="_blank"
                  className="text-white hover:text-red-500"
                >
                  {footerData.socialMedia.youtube}
                </Link>
              </li>
            </ul>
          </FooterColumn>

          {/* Fourth Column */}
          <FooterColumn title="COMPANY / ABOUT US">
            <ul className="regular-14 flex flex-col gap-4 text-gray-30">
              <li>
                <Link
                  href={footerData.links.leasingInfo}
                  className="hover:text-gray-400"
                  target="_blank"
                >
                  Leasing Info
                </Link>
              </li>
              <li>
                <Link
                  href={footerData.links.privacyStatement}
                  className="hover:text-gray-400"
                  target="_blank"
                >
                  Privacy Statement
                </Link>
              </li>
            </ul>
          </FooterColumn>

          {/* LIMA Estate Section */}
          <div className="flex flex-col gap-5">
            <FooterColumn title="LIMA Estate">
              <Image
                src={footerData.brand.logo} // Assuming the logo URL is stored here
                alt="LIMA Estate Logo"
                width={200}
                height={60}
              />
            </FooterColumn>
          </div>
        </div>

        <div className="border bg-gray-20" />
        <p className="regular-14 w-full text-center text-gray-30 pb-20">
          {footerData.brand.copyright}
        </p>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="bold-18 whitespace-nowrap uppercase">{title}</h4>{" "}
      {/* Make title bold and uppercase */}
      {children}
    </div>
  );
};

export default Footer;
