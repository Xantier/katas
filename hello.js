const arvoMap = {
  t: 10,
  j: 11,
  q: 12,
  k: 13,
  a: 14
}

const flipArvoMap = {
  10: 'T',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A',
}
const kortiks = (korttiString) => {
  const [arvoString, maa] = korttiString.split('')
  return {
    arvo: arvoMap[arvoString] ? arvoMap[arvoString] : parseInt(arvoString, 10),
    maa
  }
}

const korteista = (kortit) => {
  return kortit.map(it => `${flipArvoMap[it.arvo] ?? it.arvo}${it.maa}`)
}

const onksVari = (kortit) => {
  const ekaKortti = kortit[0]
  const returnable = kortit.every(it => it.maa === ekaKortti.maa)
  return { osuma: returnable, teksti: 'Hei, naa on kaikki saman varisii kato' }
}

const onksSuara = (kortit) => {
  const sortatutKortit = kortit.sort((a, b) => a.arvo - b.arvo)
  let edellinen = sortatutKortit[0]
  const returnable = sortatutKortit.reduce((tulos, nykyinen, idx) => {
    if (idx === 0) return tulos
    const onAssaAlapaassa = nykyinen.arvo === 14 && edellinen.arvo === 5
    const onYhtaSuurempi = nykyinen.arvo === edellinen.arvo + 1
    edellinen = nykyinen
    return tulos && (onYhtaSuurempi || onAssaAlapaassa)
  }, true)
  return { osuma: returnable, teksti: 'Viis putkee.' }
}

const onksNelkkuiset = (kortit) => {
  const arvot = kortit.reduce((acc, it) => {
    if (acc[it.arvo]) {
      acc[it.arvo] = [...acc[it.arvo], it.arvo]
    } else {
      acc[it.arvo] = [it.arvo]
    }
    return acc
  }, {})
  const returnable = Object.values(arvot).some(it => it.length === 4)
  return { osuma: returnable, teksti: 'Katos nait, nelkut.' }
}
const onkoNamaKolmikkoiset = (kortit) => {
  const arvot = kortit.reduce((acc, it) => {
    if (acc[it.arvo]) {
      acc[it.arvo] = [...acc[it.arvo], it.arvo]
    } else {
      acc[it.arvo] = [it.arvo]
    }
    return acc
  }, {})
  const returnable = Object.values(arvot).some(it => it.length === 3)
  return { osuma: returnable, teksti: 'Kolomoset! Kolomoset!' }
}

const onksPari = (kortit) => {
  const arvot = kortit.reduce((acc, it) => {
    if (acc[it.arvo]) {
      acc[it.arvo] = [...acc[it.arvo], it.arvo]
    } else {
      acc[it.arvo] = [it.arvo]
    }
    return acc
  }, {})
  const returnable = Object.values(arvot).some(it => it.length === 2)
  return { osuma: returnable, teksti: 'Ei mul oo ku pari :/' }
}

const onksPariParia = (kortit) => {
  const [eka, toka, kolkki, nelkku, femma] = kortit.sort((a, b) => a.arvo - b.arvo)
  const alapaanPari = onksPari([eka, toka]).osuma && onksPari([kolkki, nelkku, femma]).osuma
  const ylapaanPari = onksPari([eka, toka, kolkki]).osuma && onksPari([nelkku, femma]).osuma
  const returnable = alapaanPari || ylapaanPari
  return { osuma: returnable, teksti: 'No vittu, Kaks paria. Ei paha' }
}

const onksTakari = (kortit) => {
  const returnable = onkoNamaKolmikkoiset(kortit).osuma && onksPari(kortit).osuma
  return { osuma: returnable, teksti: 'Ei helvetti. Ei vittu. Tayskasi saatana' }
}

const onksVarSuara = (kortit) => {
  const returnable = onksSuara(kortit).osuma && onksVari(kortit).osuma
  return { osuma: returnable, teksti: 'Ei paljon paremmaks pygee kyl' }
}

const tsekkilaiset = [
  onksVarSuara,
  onksNelkkuiset,
  onksTakari,
  onksVari,
  onksSuara,
  onkoNamaKolmikkoiset,
  onksPariParia,
  onksPari,
  () => ({ osuma: true, teksti: 'No ei vittu mitaa. Kuha luhvasin.' })
]

const mitaMullaOli = (...korttiStringit) => {
  const kortit = korttiStringit.map(kortiks)
  const mitasSieltaLoytyikaan = tsekkilaiset.find(tsekki => {
    const onksSeTaa = tsekki(kortit)
    return onksSeTaa.osuma
  })

  return JSON.stringify({ kortit: korteista(kortit), mitaMulOli: mitasSieltaLoytyikaan(kortit).teksti })

}

console.log(mitaMullaOli('kh', 'qh', 'jh', '9h', 'th',))
console.log(mitaMullaOli('kh', 'ks', 'kd', 'kc', 'ah',))
console.log(mitaMullaOli('kh', 'ks', 'kd', 'ac', 'ah',))
console.log(mitaMullaOli('kh', '2h', '5h', '4h', 'ah',))
console.log(mitaMullaOli('3c', '2h', '5h', '4h', '6h',))
console.log(mitaMullaOli('3c', '2h', '5h', '4h', 'ah',))
console.log(mitaMullaOli('kh', 'ks', 'kd', 'qc', 'ah',))
console.log(mitaMullaOli('kh', 'ks', 'qd', 'qc', 'ah',))
console.log(mitaMullaOli('kh', 'js', 'qd', 'qc', 'ah',))
console.log(mitaMullaOli('kh', 'js', '3d', 'qc', 'ah',))
