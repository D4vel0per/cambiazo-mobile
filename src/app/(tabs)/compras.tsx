import SafeArea from "@/components/safeAreaWrapper";
import Title from "@/components/title";
import { BACKGROUND, BACKGROUND_TEXT, BAD, BUTTON, MAIN, MAIN_ALT } from "@/constants/colors";
import { CAROUSEL_INITIAL_VALUES, RENDER_CURRENCY } from "@/constants/main";
import { useMoneyState } from "@/hooks/moneyStateHook";
import { useSimpleCarousel } from "@/hooks/useSimpleCarousel";
import { Currency } from "@/types/moneyStateTypes";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { FONT } from "./_layout";

export default function Compras () {
    return (
        <SafeArea>
            <Screen />
        </SafeArea>
    )
}

function Screen () {
    return (
        <View style={styles.container}>
            <Title name="Compras!"/>
            <ProductContainer />
        </View>
    )
}

interface ProductItem {
    price: number
    currency: Currency
    name: string
}

function ProductContainer () {
    const [ products, setProducts ] = useState<ProductItem[]>([])

    return (
        <View style={styles.productContainer}>
            <AddProduct submitProduct={(prod: ProductItem) => { setProducts(prev => [ ...prev, prod ]) }}/>
            <ProductSection products={products} setProducts={setProducts}/>
            <GrandTotal products={products}/>
        </View>
    )
}

function AddProduct ({ submitProduct }: {
    submitProduct: (prod: ProductItem) => void
}) {
    const [ currencies, selectNext ] = useSimpleCarousel<Currency>(CAROUSEL_INITIAL_VALUES)
    const [ currentProduct, setCurrentProduct ] = useState<ProductItem>({
        price: 0,
        currency: "VES",
        name: "Producto"
    })
    const [ currentPriceText, setCurrentPriceText ] = useState<string>("")

    return (
        <View style={styles.addProductContainer}>
            <Pressable onPress={() => {
                selectNext()
                setCurrentProduct(prev => {
                        const newProduct: ProductItem = {
                            ...prev,
                            currency: currencies[1]
                        }
                        return newProduct
                    })
            }} style={styles.addProductButton}>
                <Text style={{fontSize: 18, textAlign: "center", fontFamily: FONT}}>{RENDER_CURRENCY[currencies[0]]}</Text>
            </Pressable>
            <View style={styles.addProductInput}>
                <TextInput 
                inputMode="decimal"
                value={currentPriceText || "0"}
                style={{fontSize: styles.addProductInput.fontSize, fontFamily: FONT}}
                onChangeText={(text) => {
                    text = (
                        text.startsWith("0") ? 
                            text.length > 1 ? text.replace(/^0/, "") : text
                        : text
                    )

                    setCurrentPriceText(text)
                    setCurrentProduct(prev => {
                        const newProduct: ProductItem = {
                            price: text ? parseFloat(text.replace(",", ".")) : 0,
                            name: prev.name,
                            currency: currencies[0]
                        }
                        return newProduct
                    })
                }}  
                />
            </View>
            <Pressable onPress={() => {
                submitProduct(currentProduct)
                setCurrentProduct(prev => ({
                    ...prev, 
                }))
            }} style={[styles.addProductButton, {flex: 2}]}>
                <Ionicons 
                    name="bag-add" 
                    color={BACKGROUND_TEXT}
                    size={24}
                />
            </Pressable>
        </View>
    )
}

function GrandTotal ({ products }: {
    products: ProductItem[]
}) {
    const [ total, setTotal ] = useState<number>(0)
    const [ carousel, selectNext ] = useSimpleCarousel<Currency>(CAROUSEL_INITIAL_VALUES)
    const [ moneyState, setCurrentCurrency ] = useMoneyState(carousel[0])

    useEffect(() => {
        let total = 0
        for (let product of products) 
            total += product.price * moneyState[product.currency]

        setTotal(total)
        
    }, [ products, moneyState ])

    return (
    <View style={styles.grandTotalContainer}>
        <View style={styles.grandTotalNumberContainer}>
            <Text style={styles.grandTotalText}>{Math.round(total * 100) / 100}</Text>
        </View>
        <View style={styles.grandTotalCurrencyContainer}>
            <Pressable style={{flex: 1}} onPress={() => {
                selectNext()
                setCurrentCurrency(carousel[1])
            }}>
                <Text style={[styles.grandTotalText, {fontSize: 20}]}>{RENDER_CURRENCY[carousel[0]]}</Text>
            </Pressable>
            
        </View>
    </View>)
}

function ProductSection ({ products, setProducts }: {
    products: ProductItem[]
    setProducts: React.Dispatch<ProductItem[]>
}) {
    const setProduct = (update: ProductItem, index: number) => {
        let updated = [ ...products ]
        updated[index] = { ...update }
        setProducts(updated)
    }
    const deleteProduct = (index: number) => {
        let updated = [ ...products ]
        updated.splice(index, 1)
        setProducts(updated)
    }

    return (
    <View style={styles.productSection}>
        <FlatList
        data={products}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.productSectionScroll}
        renderItem={({ item, index }) => (
            <Product 
                product={item}
                setProduct={(product) => setProduct(product, index)}
                deleteProduct={() => deleteProduct(index)}
            />
        )}
        ListEmptyComponent={(
            <View style={{ alignItems: "center"}}>
                <View style={{flexDirection: "row"}}>
                    <Ionicons
                    name="cart-outline"
                    size={100}
                    color={BUTTON}
                    />
                    <View style={{ 
                        transform: [{ rotate: "30deg" }]
                    }}>
                        <Ionicons
                        name="help"
                        size={60}
                        color={BAD}
                        style={{position: "relative", right: 10, top: 50}}
                        />
                    </View>
                    
                </View>
                <Text style={{
                    fontSize: 18, 
                    fontFamily: FONT, 
                    color: BUTTON,
                    textAlign: "center"
                    }}>¡Ay!—¿Todavía no hay nada?</Text>
            </View>
            
        )}

        />
    </View>

    )
}

function Product ({ product, setProduct, deleteProduct }: {
    product: ProductItem,
    setProduct: (prod: ProductItem) => void,
    deleteProduct: () => void
}) {
    const [ carousel, selectNext ] = useSimpleCarousel<Currency>(CAROUSEL_INITIAL_VALUES)
    const [ currentPriceText, setCurrentPriceText ] = useState<string>(product.price.toString())

    useEffect(() => {
        const index = carousel.indexOf(product.currency)
        if (index > 0) {
            for (let i = 0; i < index; i++) {
                selectNext()
            }
        }
    }, [ product, carousel ])

    return (
    <View style={ styles.productItem }>
        <View style={styles.productItemInputContainer}>
            <TouchText
            containerStyle={styles.productItemInput}
            textStyle={styles.productItemText}
            inputStyle={[styles.productItemText, { backgroundColor: BUTTON }]}
            value={product.name}
            onChangeText={(text) => setProduct({ ...product, name: text })}
            inputMode="text"
            />
            <Pressable onPress={deleteProduct} style={styles.productItemDelete}>
                <Ionicons 
                name="bag-remove"
                size={24}
                color={BACKGROUND_TEXT}
                
                />
            </Pressable>
        </View>
        <View style={styles.productItemTextContainer}>
            <TouchText
            containerStyle={{flex: 1}}
            textStyle={styles.productItemText}
            inputStyle={[styles.productItemText, { backgroundColor: MAIN_ALT }]}
            value={currentPriceText || "0"}
            onChangeText={(text) => {
                text = (
                        text.startsWith("0") ? 
                            text.length > 1 ? text.replace(/^0/, "") : text
                        : text
                    )
                setCurrentPriceText(text)
                setProduct({ ...product, price: parseFloat(text.replace(",", ".")) || 0 })
            }}
            inputMode="decimal"
            />

            <Pressable style={{flex: 1}} onPress={() => {
                setProduct({...product, currency: carousel[1]})
            }}>
                <Text style={styles.productItemText}>{RENDER_CURRENCY[product.currency]}</Text>
            </Pressable>
            
            
        </View>
    </View>
    )
}

interface TouchTextProps extends TextInputProps {
    onChangeText: (text: string) => void,
    textStyle?: TextStyle | TextStyle[],
    inputStyle?: TextStyle | TextStyle[],
    containerStyle?: ViewStyle | ViewStyle[],
    value: string,
}

function TouchText ({onChangeText, containerStyle, textStyle, inputStyle, value, ...props}: TouchTextProps) {
    const [ showInput, setShowInput ] = useState<boolean>(false)

    return (
        <Pressable 
            onPress={() => {
                setShowInput(prev => !prev)
            }}
            onBlur={() => {
                setShowInput(false)
            }}
            style={containerStyle}
            >
                { !showInput ? (
                    <Text style={textStyle}>{value}</Text>
                ) : (
                    <TextInput
                        autoFocus={true}
                        value={value}
                        style={inputStyle}
                        onChangeText={onChangeText}
                        {...props}
                    />
                ) }
        </Pressable>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND
    },
    addProductInput: {
        backgroundColor: MAIN,
        flex: 8,
        justifyContent: "center",
        fontSize: 20,
    },
    addProductContainer: {
        flexDirection: "row",
        flex: 8,
    },
    addProductButton: {
        flex: 6,
        backgroundColor: BUTTON,
        justifyContent: "center",
        alignItems: "center"
    },
    productContainer: {
        paddingTop: 15,
        flex: 1
    },
    productSection: {
        flex: 64,
    },
    productSectionScroll: {
        padding: 15,
        gap: 20
    },
    productItem: {
        backgroundColor: MAIN,
        borderRadius: 10
    },
    productItemInput: {
        flex: 5
    },
    productItemDelete: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: BAD,
        borderTopRightRadius: 10
    },
    productItemInputContainer: {
        backgroundColor: BUTTON,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: "row",
    },
    productItemTextContainer: {
        flexDirection: "row",
        flex: 2,
        padding: 10
    },
    productItemText: {
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "center",
        fontFamily: FONT
    },
    grandTotalContainer: {
        flex: 8,
        backgroundColor: BUTTON,
        flexDirection: "row"
    },
    grandTotalNumberContainer: {
        flex: 12
    },
    grandTotalCurrencyContainer: {
        flex: 10,
        backgroundColor: MAIN,
        alignItems: "center",
        justifyContent: "center"
    },
    grandTotalText: {
        flex: 1,
        fontSize: 24,
        fontFamily: FONT,
        textAlign: "center",
        textAlignVertical: "center"
    }
})