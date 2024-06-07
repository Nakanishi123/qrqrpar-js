import {
  Box,
  Button,
  ColorPicker,
  Flex,
  FormControl,
  GridItem,
  Image,
  NumberInput,
  Option,
  Select,
  SimpleGrid,
  Text,
  Textarea,
} from "@yamada-ui/react";
import init, {
  EcLevel,
  QrShape,
  QrStyle,
  QrType,
  RmqrStrategy,
  make_qr,
  make_qr_png,
} from "qrqrpar-js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const getCanUseEcLevel = (type: QrType) => {
  switch (type) {
    case QrType.Rmqr:
      return [EcLevel.M, EcLevel.H];
    case QrType.Micro:
      return [EcLevel.L, EcLevel.M, EcLevel.Q];
    default:
      return [EcLevel.L, EcLevel.M, EcLevel.Q, EcLevel.H];
  }
};

export default function QrGen() {
  const [url, setUrl] = useState("");
  const [errorText, setErrorText] = useState("");
  const { control, watch, setValue } = useForm({
    defaultValues: {
      message: "",
      type: QrType.Rmqr,
      ecLevel: EcLevel.M,
      stragety: RmqrStrategy.Area,
      style: QrShape.Square,
      color: "#000000ff",
      background: "#ffffffff",
      width: 1024,
      margin: 2,
    },
  });
  const watchedValues = watch();
  const ecLevelOptions = getCanUseEcLevel(watchedValues.type);

  useEffect(() => {
    if (watchedValues.message === "") return setErrorText("Message is empty");
    const qrStyle = new QrStyle(
      watchedValues.color,
      watchedValues.background,
      watchedValues.style,
      watchedValues.width,
      watchedValues.margin
    );
    try {
      const qr_svg = make_qr(
        watchedValues.message,
        watchedValues.type,
        watchedValues.ecLevel,
        qrStyle,
        watchedValues.stragety
      );
      const svg_blob = new Blob([qr_svg], { type: "image/svg+xml" });
      setUrl(URL.createObjectURL(svg_blob));
      setErrorText("");
    } catch (e: any) {
      setErrorText(e);
      console.log(e);
    }
    return;
  }, [
    watchedValues.message,
    watchedValues.type,
    watchedValues.ecLevel,
    watchedValues.color,
    watchedValues.background,
    watchedValues.style,
    watchedValues.width,
    watchedValues.margin,
    watchedValues.stragety,
  ]);

  // ec level check
  useEffect(() => {
    const canUseEclevel = getCanUseEcLevel(watchedValues.type);
    if (!canUseEclevel.includes(watchedValues.ecLevel)) {
      setValue("ecLevel", canUseEclevel[0]);
    }
  }, [watchedValues.type, watchedValues.ecLevel, setValue]);

  useEffect(() => {
    init();
  }, []);

  const download = () => {
    if (url === "") return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr.svg";
    link.click();
  };
  const downloadPng = () => {
    if (url === "") return;
    const style = new QrStyle(
      watchedValues.color,
      watchedValues.background,
      watchedValues.style,
      watchedValues.width,
      watchedValues.margin
    );
    try {
      const qr_png = make_qr_png(
        watchedValues.message,
        watchedValues.type,
        watchedValues.ecLevel,
        style,
        watchedValues.stragety
      );
      const png_blob = new Blob([qr_png], { type: "image/png" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(png_blob);
      link.download = "qr.png";
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <FormControl>
      <Text as="h5" size="md" marginBottom={1} isTruncated>
        Your message
      </Text>
      <Controller
        name="message"
        control={control}
        render={({ field }) => {
          return (
            <Textarea
              color={["gray.800", "gray.200"]}
              borderColor={["gray.800", "gray.200"]}
              autosize
              minRows={3}
              ref={field.ref}
              placeholder="message"
              value={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          );
        }}
      />
      <SimpleGrid w="full" columns={{ base: 2 }} gap="md" marginTop="md">
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            Qr type
          </Text>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                borderColor={["gray.800", "gray.200"]}
                placeholder="Select QR type"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(Number(e))}
                placeholderInOptions={false}
                defaultValue={QrType.Rmqr.toString()}
              >
                <Option value={QrType.Rmqr.toString()}>rMQR</Option>
                <Option value={QrType.Micro.toString()}>Micro</Option>
                <Option value={QrType.Qr.toString()}>Normal</Option>
              </Select>
            )}
          />
        </GridItem>
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            Error correction level
          </Text>
          <Controller
            name="ecLevel"
            control={control}
            render={({ field }) => (
              <Select
                borderColor={["gray.800", "gray.200"]}
                placeholder="Select QR type"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(Number(e))}
                placeholderInOptions={false}
                value={watchedValues.ecLevel.toString()}
              >
                {ecLevelOptions.map((level) => (
                  <Option key={level} value={level.toString()}>
                    {`${
                      level === EcLevel.L
                        ? "L (7%)"
                        : level === EcLevel.M
                        ? "M (15%)"
                        : level === EcLevel.Q
                        ? "Q (25%)"
                        : "H (30%)"
                    }`}
                  </Option>
                ))}
              </Select>
            )}
          />
        </GridItem>
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            rMQR Strategy
          </Text>
          <Controller
            name="stragety"
            control={control}
            render={({ field }) => (
              <Select
                borderColor={["gray.800", "gray.200"]}
                placeholder="Select rMQR Strategy"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(Number(e))}
                placeholderInOptions={false}
                defaultValue={RmqrStrategy.Area.toString()}
              >
                <Option value={RmqrStrategy.Width.toString()}>Width</Option>
                <Option value={RmqrStrategy.Height.toString()}>Height</Option>
                <Option value={RmqrStrategy.Area.toString()}>Area</Option>
              </Select>
            )}
          />
        </GridItem>
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            Qr style
          </Text>
          <Controller
            name="style"
            control={control}
            render={({ field }) => (
              <Select
                borderColor={["gray.800", "gray.200"]}
                placeholder="Select QR Shape"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(Number(e))}
                placeholderInOptions={false}
                defaultValue={QrShape.Square.toString()}
              >
                <Option value={QrShape.Square.toString()}>Square</Option>
                <Option value={QrShape.Round.toString()}>Round</Option>
              </Select>
            )}
          />
        </GridItem>
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            Color
          </Text>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker
                borderColor={["gray.800", "gray.200"]}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            )}
          />
        </GridItem>
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            Background color
          </Text>
          <Controller
            name="background"
            control={control}
            render={({ field }) => (
              <ColorPicker
                borderColor={["gray.800", "gray.200"]}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            )}
          />
        </GridItem>
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            Width
          </Text>
          <Controller
            name="width"
            control={control}
            render={({ field }) => (
              <NumberInput
                borderColor={["gray.800", "gray.200"]}
                min={1}
                defaultValue={field.value}
                onChange={(e) => field.onChange(parseInt(e))}
              />
            )}
          />
        </GridItem>
        <GridItem w="full" rounded="md">
          <Text as="h5" size="md" marginBottom={1} isTruncated>
            Margin
          </Text>
          <Controller
            name="margin"
            control={control}
            render={({ field }) => (
              <NumberInput
                borderColor={["gray.800", "gray.200"]}
                min={0}
                step={0.1}
                defaultValue={field.value}
                onChange={(e) => field.onChange(Number(e))}
              />
            )}
          />
        </GridItem>
      </SimpleGrid>
      {errorText ? (
        <Text textAlign="center" fontSize="4xl" color="red.500" isTruncated>
          {errorText}
        </Text>
      ) : (
        <Box p={4}>
          <Box
            w="full"
            textAlign="center"
            backgroundImage={[
              "conic-gradient(#FFFFFF 0deg 90deg, #DFDFDF 90deg 180deg, #FFFFFF 180deg 270deg, #DFDFDF 270deg 360deg);",
              "conic-gradient(#000000 0deg 90deg, #1E1E1E 90deg 180deg, #000000 180deg 270deg, #1E1E1E 270deg 360deg);",
            ]}
            p={2}
            backgroundSize={"30px 30px"}
            borderWidth={2}
            borderColor={["red.700", "red.300"]}
          >
            <Image src={url} alt="QR code" maxW={"full"} />
          </Box>
          <Flex justifyContent="center" marginTop={2} gap="md">
            <Button onClick={download} colorScheme={"primary"}>
              Download SVG
            </Button>
            <Button onClick={downloadPng} colorScheme={"secondary"}>
              Download PNG
            </Button>
          </Flex>
        </Box>
      )}
    </FormControl>
  );
}
