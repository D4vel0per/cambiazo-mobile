import SafeArea from "@/components/safeAreaWrapper";
import { RENDER_CURRENCY } from "@/constants/main";
import { useMoneyState } from "@/hooks/moneyStateHook";
import { useSimpleCarousel } from "@/hooks/useSimpleCarousel";
import { Currency, MoneyState } from "@/types/moneyStateTypes";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <SafeArea>
      <View style={styles.container}>
          <View style={styles.title}>
            <Text>CAMBIAZO!</Text>
            <Text>¿No puedes con la inflación? ¡Nosotros tampoco!</Text>
          </View>
          <LastInfo />
      </View>
    </SafeArea>
  );
}

function LastInfo () {
  const [ currencies, selectNext ] = useSimpleCarousel<Currency>(["VES", "USD", "USD_P", "EUR", "EUR_P"])
  const [ moneyState, setCurrentCurrency ] = useMoneyState("VES")

  return (
    <View style={styles.product_container}>
      <CurrencySelector carousel={currencies} nextCurrency={() => {
        setCurrentCurrency(currencies[1])
        selectNext()
      }}/>
      <CurrencyList moneyState={moneyState} carousel={currencies} />
    </View>
  )
}

function CurrencySelector ({ carousel, nextCurrency}: 
  { carousel: Currency[], nextCurrency: () => void }
) {
  return (
    <View style={styles.selectorContainer}>
      <View style={styles.selectorTextContainer}>
        <Text style={styles.selectorText}>{`Tasas del día`}</Text>
      </View>
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
    <View>
      <Text>{RENDER_CURRENCY[currency]}</Text>
      <Text>{Math.round(value * 10000) / 10000}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    flex: 2,
    padding: 5,
    backgroundColor: "#126b0a"
  },
  product_container: {
    flex: 4,
    backgroundColor: "#0a5b6b",
    width: "100%"
  },
  selectorContainer: {
    flex: 1,
    backgroundColor: "#389db1",
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  selectorButton: {
    flex: 1,
    backgroundColor: "#8ebce2",
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
    fontSize: 24
  },
  selectorMessage: {
    flex: 1
  },
  priceView: {
    paddingHorizontal: 20,
    justifyContent: "center",
    flex: 3
  }
});
