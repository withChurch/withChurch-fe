// src/components/common/Footer.jsx
import React from "react";
import "./Footer.css";
import {Youtube, Instagram} from "lucide-react";
import { useChurchConfig } from "../../contexts/ChurchConfigContext";

export default function Footer() {
  const { config } = useChurchConfig();
  const footer = config?.footerInfo;

  if (!footer) return null;

  const { officeAddress, tel, fax, copyrightText, socialLinks } = footer;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-text">
          {officeAddress && (
            <>
              사무실: {officeAddress}
              <br />
            </>
          )}

          {(tel || fax) && (
            <>
              {tel && <>TEL: {tel} </>}
              {fax && <>│ FAX: {fax}</>}
              <br />
            </>
          )}

          {copyrightText && <>{copyrightText}</>}
        </div>

        {socialLinks?.length > 0 && (
          <div className="footer-auth">
            {socialLinks.map((link, idx) => {
              const type = link.type?.toLowerCase();

              if (type?.includes("instagram")) {
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={22} />
                  </a>
                );
              }

              if (type?.includes("youtube")) {
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube size={22} />
                  </a>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </footer>
  );
}