"use client";
import { Box } from "@chakra-ui/react";
import Header from "./components/Header";

export default function Home() {
  return (
    <Box as="main">
      <Header title="QR Generator" />
    </Box>
  );
}
