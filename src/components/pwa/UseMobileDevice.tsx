import { Modal } from "@mui/material";
import React from "react";
import image from "@/assets/mobile.png";
import Image from "next/image";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { GoCheckCircleFill } from "react-icons/go";
const UseMobileDevice = ({ closePrompt }: { closePrompt: any }) => {
  const [open, setOpen] = React.useState(true);
  const t = useTranslations();
  const handleClose = () => {
    setOpen(false);
    closePrompt();
  };
  return (
    <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box>
        <Image style={{ width: "100%", maxWidth: "300px", display: "block", marginInline: "auto", height: "auto" }} src={image} alt="Searching products in phone" />
        <Text>{t("pwa.useMobile")}</Text>
        <Button onClick={handleClose}>
          <span>{t("pwa.understand")}</span>
          <GoCheckCircleFill />
        </Button>
      </Box>
    </Modal>
  );
};

const Text = styled.p`
  color: #000000;
  font-size: 24px;
  text-align: center;
  margin-top: 60px;
  max-width: 400px;
`;

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  border-radius: 8px;
  width: 100%;
  max-width: fit-content;
  padding: 24px;
`;

const Button = styled.button`
  font-size: 20px;
  background-color: transparent;
  color: #eab305;
  font-feature-settings: "case" on;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  margin-inline: auto;
  margin-top: 24px;
  @media (min-width: 1280px) {
    font-size: 20px;
  }
`;

export default UseMobileDevice;
