mod utils;

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
        QrType::Qr => qrqrpar::QrCode::with_error_correction_level(text, eclevel.into()),
    };

    match qrcode {
        Ok(qrcode) => Ok(qrcode.to_svg(&style.into())),
        Err(e) => Err(e.to_string()),
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum QrType {
    Rmqr,
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
impl QrStyle {
    #[wasm_bindgen(setter)]
    pub fn set_color(&mut self, color: String) {
        self.color = color;
    }

    #[wasm_bindgen(setter)]
    pub fn set_background_color(&mut self, background_color: String) {
        self.background_color = background_color;
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
