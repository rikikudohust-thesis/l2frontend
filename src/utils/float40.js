
import { BigNumber } from "ethers";

/**
 * Convert a float to a fix
 * @param {Scalar} fl - Scalar encoded in float
 * @returns {Scalar} Scalar encoded in fix
 */
function float2Fix(fl) {
  const m = fl % 0x800000000;
  const e = Math.floor(fl / 0x800000000);

  const base = BigNumber.from(10);
  const exp = base.pow(BigNumber.from(e));
  //   const exp = Scalar.pow(10, e);

  //   let res = Scalar.mul(m, exp);
  let res = exp.mul(BigNumber.from(m));

  return res;
}

/**
 * Convert a fix to a float
 * @param {String|Number} _f - Scalar encoded in fix
 * @returns {Scalar} Scalar encoded in float
 */
function fix2Float(_f) {
  //   const f = Scalar.e(_f);
  const f = BigNumber.from(_f);
  if (f.isZero()) return 0;
  //   if (Scalar.isZero(f)) return 0;

  let m = f;
  let e = 0;

  //   while (Scalar.isZero(Scalar.mod(m, 10)) && !Scalar.isZero(Scalar.div(m, 0x800000000))) {
  //     m = Scalar.div(m, 10);
  //     e++;
  //   }

  while (m.mod(10).isZero() && !m.div(BigNumber.from(0x800000000)).isZero()) {
    m = m.div(10);
    e++;
  }

  if (e > 31) {
    throw new Error("number too big");
  }

  //   if (!Scalar.isZero(Scalar.div(m, 0x800000000))) {
  //     throw new Error("not enough precission");
  //   }

  if (!m.div(BigNumber.from("0x800000000")).isZero()) {
    throw new Error("not enough precission");
  }

  //   const res = Scalar.toNumber(m) + e * 0x800000000;
  const res = m.toNumber() + e * 0x800000000;
  return res;
}

/**
 * Convert a float to a fix, always rounding down
 * @param {Scalar} fl - Scalar encoded in float
 * @returns {Scalar} Scalar encoded in fix
 */
function floorFix2Float(_f) {
  //   const f = Scalar.e(_f);
  const f = BigNumber.from(_f);
  //   if (Scalar.isZero(f)) return 0;
  if (f.isZero()) return 0;

  let m = f;
  let e = 0;

  //   while (!Scalar.isZero(Scalar.div(m, 0x800000000))) {
  //     m = Scalar.div(m, 10);
  //     e++;
  //   }
  while (!m.div(m, BigNumber.from(0x800000000)).isZero()) {
    m = m.div(10);
    e++;
  }

  if (e > 31) {
    throw new Error("number too big");
  }

  //   const res = Scalar.toNumber(m) + e * 0x800000000;
  const res = m.toNumber() + e * 0x800000000;
  return res;
}

/**
 * Round large integer by encode-decode in float40 encoding
 * @param {Scalar} fix
 * @returns {Scalar} fix rounded
 */
function round(fix) {
  //   const f = Scalar.e(fix);
  const f = BigNumber.from(fix);
  //   if (Scalar.isZero(f)) return 0;
  if (f.isZero()) return 0;

  let m = f;
  let e = 0;

  //   while (!Scalar.isZero(Scalar.div(m, 0x800000000))) {
  //     const roundUp = Scalar.gt(Scalar.mod(m, 10), 5);
  //     m = Scalar.div(m, 10);
  //     if (roundUp) m = Scalar.add(m, 1);
  //     e++;
  //   }

  while (!m.div(BigNumber.from("0x800000000")).isZero()) {
    // const roundUp = Scalar.gt(Scalar.mod(m, 10), 5);
    const roundUp = m.mod(10).gt(5);
    // m = Scalar.div(m, 10);
    m = m.div(10);
    // if (roundUp) m = Scalar.add(m, 1);
    if (roundUp) m = m.add(m, 1);
    e++;
  }

  if (e > 31) {
    throw new Error("number too big");
  }

  //   const res = Scalar.toNumber(m) + e * 0x800000000;
  const res = m.toNumber() + e * 0x800000000;

  return float2Fix(res);
}

export {
  fix2Float,
  float2Fix,
  floorFix2Float,
  round,
};
