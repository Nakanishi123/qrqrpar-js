use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn make_qr(
    text: &str,
    qrtype: QrType,
    eclevel: EcLevel,
    style: QrStyle,
    strategy: RmqrStrategy,
) -> Result<String, String> {
    let qrcode = match qrtype {
        QrType::Rmqr => qrqrpar::QrCode::rmqr_with_options(text, eclevel.into(), strategy.into()),
        QrType::Micro => get_min_micro(text, eclevel),
        QrType::Qr => qrqrpar::QrCode::with_error_correction_level(text, eclevel.into()),
    };

    match qrcode {
        Ok(qrcode) => Ok(qrcode.to_svg(&style.into())),
        Err(e) => Err(e.to_string()),
    }
}

#[wasm_bindgen]
pub fn make_qr_png(
    text: &str,
    qrtype: QrType,
    eclevel: EcLevel,
    style: QrStyle,
    strategy: RmqrStrategy,
) -> Result<Vec<u8>, String> {
    let qrcode = match qrtype {
        QrType::Rmqr => qrqrpar::QrCode::rmqr_with_options(text, eclevel.into(), strategy.into()),
        QrType::Micro => get_min_micro(text, eclevel),
        QrType::Qr => qrqrpar::QrCode::with_error_correction_level(text, eclevel.into()),
    };

    match qrcode {
        Ok(qrcode) => Ok(qrcode.to_png(&style.into()).unwrap()),
        Err(e) => Err(e.to_string()),
    }
}

fn get_min_micro(text: &str, eclevel: EcLevel) -> qrqrpar::QrResult<qrqrpar::QrCode> {
    for i in 1..4 {
        let qrcode =
            qrqrpar::QrCode::with_version(text, qrqrpar::Version::Micro(i), eclevel.into());
        if qrcode.clone().is_ok() {
            return qrcode;
        }
    }
    qrqrpar::QrCode::with_version(text, qrqrpar::Version::Micro(4), eclevel.into())
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum QrType {
    Rmqr,
    Micro,
    Qr,
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum EcLevel {
    L,
    M,
    Q,
    H,
}

impl From<EcLevel> for qrqrpar::EcLevel {
    fn from(eclevel: EcLevel) -> Self {
        match eclevel {
            EcLevel::L => qrqrpar::EcLevel::L,
            EcLevel::M => qrqrpar::EcLevel::M,
            EcLevel::Q => qrqrpar::EcLevel::Q,
            EcLevel::H => qrqrpar::EcLevel::H,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum QrShape {
    Square,
    Round,
}

impl From<QrShape> for qrqrpar::QrShape {
    fn from(qrshape: QrShape) -> Self {
        match qrshape {
            QrShape::Square => qrqrpar::QrShape::Square,
            QrShape::Round => qrqrpar::QrShape::Round,
        }
    }
}

#[wasm_bindgen]
pub struct QrStyle {
    color: String,
    background_color: String,
    pub shape: QrShape,
    pub width: u32,
    pub quiet_zone: f64,
}

#[wasm_bindgen]
impl QrStyle {
    #[wasm_bindgen(constructor)]
    pub fn new(
        color: String,
        background_color: String,
        shape: QrShape,
        width: u32,
        quiet_zone: f64,
    ) -> Self {
        QrStyle {
            color,
            background_color,
            shape,
            width,
            quiet_zone,
        }
    }
}

impl From<QrStyle> for qrqrpar::QrStyle {
    fn from(qrstyle: QrStyle) -> Self {
        qrqrpar::QrStyle {
            color: qrstyle.color,
            background_color: qrstyle.background_color,
            shape: qrstyle.shape.into(),
            width: qrstyle.width,
            quiet_zone: qrstyle.quiet_zone,
        }
    }
}

#[wasm_bindgen]
pub enum RmqrStrategy {
    Width,
    Height,
    Area,
}

impl From<RmqrStrategy> for qrqrpar::RmqrStrategy {
    fn from(rmqrstrategy: RmqrStrategy) -> Self {
        match rmqrstrategy {
            RmqrStrategy::Width => qrqrpar::RmqrStrategy::Width,
            RmqrStrategy::Height => qrqrpar::RmqrStrategy::Height,
            RmqrStrategy::Area => qrqrpar::RmqrStrategy::Area,
        }
    }
}
