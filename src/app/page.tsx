"use client";
import { Box, Flex, Heading, Link } from "@yamada-ui/react";
import { FaGithub } from "react-icons/fa";
import QrGen from "./QrGen";
import ThemeToggleButton from "./components/ThemeToggleButton";

export default function Home() {
  return (
    <Box as="main" justifyContent="center">
      <Box m="auto" maxW="3xl" justifyContent="center" p={2}>
        <Flex w="full" m="1em">
          <Box flexGrow={1} textAlign="center" alignContent="center">
            <Link
              href="https://github.com/Nakanishi123/qrqrpar"
              target="_blank"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <FaGithub size={"2.5em"} />
            </Link>
          </Box>
          <Heading textAlign="center" flexGrow={0} as="h1">
            QR Generator
          </Heading>
          <Box flexGrow={1} textAlign="center" alignContent="center">
            <ThemeToggleButton />
          </Box>
        </Flex>
        <QrGen />
      </Box>
    </Box>
  );
}
