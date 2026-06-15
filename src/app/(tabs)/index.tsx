import SafeArea from "@/components/safeAreaWrapper";
import { BACKGROUND, BACKGROUND_TEXT, BUTTON, MAIN_ALT } from "@/constants/colors";
import { RENDER_CURRENCY } from "@/constants/main";
import { useMoneyState } from "@/hooks/moneyStateHook";
import { useSimpleCarousel } from "@/hooks/useSimpleCarousel";
import { Currency, MoneyState } from "@/types/moneyStateTypes";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FONT } from "./_layout";

export default function Index() {
  return (
    <SafeArea>{
      <Screen />
    }</SafeArea>
  );
}

function Screen () {
  return (
    <View style={styles.container}>
      <Hero />
      <LastInfo />
    </View>
  )
}

function Hero () {
  return (
    <View style={styles.hero}>
      <View style={[styles.heroTextContainer, {backgroundColor: MAIN_ALT}]}>
        <Text style={[styles.heroText, {fontSize: 36}]}>Cambiazo!</Text>
      </View>
      <View style={[styles.heroTextContainer, {flex: 1}]}>
        <Text style={styles.heroText}>{`El calmante para el dolor de cabeza del BCV`}</Text>
      </View>
    </View>
  )
}


function LastInfo () {
  const [ currencies, selectNext ] = useSimpleCarousel<Currency>(["VES", "USD", "USD_P", "EUR", "EUR_P"])
  const [ resolved, moneyState, setCurrentCurrency ] = useMoneyState("VES")

  return resolved ? (
    <View style={styles.product_container}>
      <CurrencySelector carousel={currencies} nextCurrency={() => {
        setCurrentCurrency(currencies[1])
        selectNext()
      }}/>
      <CurrencyList moneyState={moneyState} carousel={currencies} />
    </View>
  ) : null
}

function CurrencySelector ({ carousel, nextCurrency}: 
  { carousel: Currency[], nextCurrency: () => void }
) {
  return (
    <View style={styles.selectorContainer}>
      <Pressable style={styles.selectorButton} onPress={() => {
        nextCurrency()
      }}>
        <Text style={styles.selectorText}>{RENDER_CURRENCY[carousel[0]]}</Text>
      </Pressable>
    </View>
  )
}

function CurrencyList ({ moneyState, carousel }: 
  { moneyState: MoneyState, carousel: Currency[] }
) {
  return (<View style={styles.priceView}>
      {carousel.map((a, i) => {
        if (i !== 0)
         return <CurrencyElem key={i} currency={a} value={moneyState[a]}/>
      })}
  </View>
  )
}

function CurrencyElem({ currency, value }: { 
  key: number, currency: Currency, value: number }
) {
  return (
    <View style={styles.currencyElem}>
      <Text style={styles.currencyElemText}>{RENDER_CURRENCY[currency]}</Text>
      <Text style={styles.currencyElemText}>{Math.round(value * 10000) / 10000}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND
  },
  hero: {
    flex: 1.5,
  },
  heroTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  heroText: {
    flex: 1,
    width: "100%",
    fontSize: 22,
    fontFamily: FONT,
    textAlign: "center",
    textAlignVertical: "center",
    color: BACKGROUND_TEXT,
    padding: 10
  },
  product_container: {
    flex: 4,
    width: "100%"
  },
  selectorContainer: {
    flex: 1,
    padding: 20
  },
  selectorButton: {
    flex: 1,
    backgroundColor: BUTTON,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    height: "70%"
  },
  selectorTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  selectorText: {
    fontSize: 24,
    color: BACKGROUND_TEXT,
    fontFamily: FONT
  },
  selectorMessage: {
    flex: 1
  },
  priceView: {
    flex: 3,
    gap: 10,
    paddingBottom: 10
  },
  currencyElem: {
    flex: 1,
    padding: 10,
    backgroundColor: MAIN_ALT,
    flexDirection: "row"
  },
  currencyElemText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: BACKGROUND_TEXT,
    fontSize: 20,
    fontFamily: FONT
  }
});
