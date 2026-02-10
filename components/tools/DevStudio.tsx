"use client";

import StudioLayout, { type StudioSection } from "./_StudioLayout";
import Base64EncoderDecoder from "./Base64EncoderDecoder";
import UrlEncoderDecoder from "./UrlEncoderDecoder";
import HashGenerator from "./HashGenerator";
import HmacSigner from "./HmacSigner";
import JwtDecoder from "./JwtDecoder";
import UuidUlidGenerator from "./UuidUlidGenerator";
import PasswordGenerator from "./PasswordGenerator";
import JsonFormatter from "./JsonFormatter";
import JsonDiffPatchViewer from "./JsonDiffPatchViewer";
import ApiRequestBuilder from "./ApiRequestBuilder";
import EnvVarValidator from "./EnvVarValidator";
import CronGenerator from "./CronGenerator";
import RegexTester from "./RegexTester";
import LiDistinctionTester from "./LiDistinctionTester";
import FileCorrupter from "./FileCorrupter";

const SECTIONS: StudioSection[] = [
  {
    title: "Encode & Sign",
    items: [
      {
        id: "base64",
        label: "Base64 Encoder/Decoder",
        description: "Encode/decode Base64.",
        slug: "base64",
        render: () => <Base64EncoderDecoder />,
      },
      {
        id: "url-encoder",
        label: "URL Encoder/Decoder",
        description: "Encode/decode URL components.",
        slug: "url-encoder",
        render: () => <UrlEncoderDecoder />,
      },
      {
        id: "hash-generator",
        label: "Hash Generator",
        description: "Generate hashes locally using WebCrypto.",
        slug: "hash-generator",
        render: () => <HashGenerator />,
      },
      {
        id: "hmac-signer",
        label: "HMAC Signer",
        description: "Sign and verify HMAC signatures.",
        slug: "hmac-signer",
        render: () => <HmacSigner />,
      },
    ],
  },
  {
    title: "Tokens & IDs",
    items: [
      {
        id: "jwt-decoder",
        label: "JWT Decoder",
        description: "Decode JWT header and payload locally.",
        slug: "jwt-decoder",
        render: () => <JwtDecoder />,
      },
      {
        id: "uuid-ulid-generator",
        label: "UUID / ULID Generator",
        description: "Generate UUID v4 and ULID values.",
        slug: "uuid-ulid-generator",
        render: () => <UuidUlidGenerator />,
      },
      {
        id: "password-generator",
        label: "Password Generator",
        description: "Generate strong passwords locally.",
        slug: "password-generator",
        render: () => <PasswordGenerator />,
      },
    ],
  },
  {
    title: "JSON & API",
    items: [
      {
        id: "json-formatter",
        label: "JSON Formatter",
        description: "Validate and format JSON.",
        slug: "json-formatter",
        render: () => <JsonFormatter />,
      },
      {
        id: "json-diff-patch",
        label: "JSON Diff & Patch",
        description: "Compare JSON and generate patch ops.",
        slug: "json-diff-patch",
        render: () => <JsonDiffPatchViewer />,
      },
      {
        id: "api-request-builder",
        label: "API Request Builder",
        description: "Build requests and export curl.",
        slug: "api-request-builder",
        render: () => <ApiRequestBuilder />,
      },
    ],
  },
  {
    title: "Config & Patterns",
    items: [
      {
        id: "env-var-validator",
        label: "Env Var Validator",
        description: "Validate .env files for issues.",
        slug: "env-var-validator",
        render: () => <EnvVarValidator />,
      },
      {
        id: "cron-generator",
        label: "Cron Generator",
        description: "Build cron expressions visually.",
        slug: "cron-generator",
        render: () => <CronGenerator />,
      },
      {
        id: "regex-tester",
        label: "Regex Tester",
        description: "Test regex patterns and preview matches.",
        slug: "regex-tester",
        render: () => <RegexTester />,
      },
    ],
  },
  {
    title: "QA Utilities",
    items: [
      {
        id: "li-distinction-tester",
        label: "L/I Distinction Tester",
        description: "Spot confusing I vs l.",
        slug: "li-distinction-tester",
        render: () => <LiDistinctionTester />,
      },
      {
        id: "file-corrupter",
        label: "File Corrupter",
        description: "Corrupt a file for QA testing.",
        slug: "file-corrupter",
        render: () => <FileCorrupter />,
      },
    ],
  },
];

export default function DevStudio() {
  return (
    <StudioLayout
      title="Developer Studio"
      description="All developer utilities in one workspace."
      sections={SECTIONS}
    />
  );
}
