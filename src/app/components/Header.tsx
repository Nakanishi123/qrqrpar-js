import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import ThemeToggleButton from "./ThemeToggleButton";

export default function Header({ title }: { title: string }) {
  return (
    <Box
      as="header"
      p={4}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Spacer />
      <Flex flexGrow={1} justifyContent="center">
        <Text fontSize="3xl">{title}</Text>
      </Flex>
      <Box flexGrow={1}>
        <ThemeToggleButton />
      </Box>
    </Box>
  );
}
