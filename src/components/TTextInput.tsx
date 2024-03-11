import React, { useEffect, useRef, useState } from 'react';
import { Animated, ViewProps, StyleSheet, TextInput, View, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Colors } from '../utils/Colors';

interface TTextInput extends ViewProps {
   clearTextOnFocus: boolean,
   ref?: any,
   autoCorrect: boolean,
   style: object,
   value?: any,
   onChange: any,
   secureTextEntry: boolean,
   placeholder: string,
   multiline?: any,
   keyboardType?: any,
   returnKeyType?: any,
   autoCapitalize?: any
   autoCompleteType?: any
   editable?: any
   blurOnSubmit?: any
   autoFocus?: boolean,
   required?: boolean,
   heightInput?: number,
   animationY?: number,
   heightText?: number,
   svgIcon?: any,
   paddingRight?: boolean,
   maxLength?: number | undefined,
   textAlignVertical?: "center" | "auto" | "bottom" | "top" | undefined
   textColor?: string
   borderError?: boolean,
   showRequired?: boolean
}

export default function TTextInput(props: TTextInput) {
   const [inputHeight, setInputHeight] = useState(0);
   const [placeholderWidth, setWidth] = useState(0);
   const [onClickInput, setOnClickInput] = useState<boolean>(false);

   const heightInput = props.heightInput ? props.heightInput : 55;
   const heightText = props.heightText ? props.heightText : 1.9;
   const animationY = props.animationY ? props.animationY : 2;

   const _animation = useRef(new Animated.Value(0)).current;
   const lengthPlaceholder = props.placeholder.length > 7 ? 11 : 13;

   useEffect(() => {
      if (props.value) {
         animate(1)
      } else if (props.value === undefined || props.value === '') {
         animate(0)
      }
   }, [props.value])

   const onFocus = () => {
      animate(1)
      setOnClickInput(true)
   };

   const onBlur = () => {
      !props.value && animate(0);
      setOnClickInput(false)
   }

   const translateY = _animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -heightInput / animationY],
   });

   const translateX = _animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -placeholderWidth / lengthPlaceholder],
   });
   const scale = _animation.interpolate({
      inputRange: [-0.2, 1.5],
      outputRange: [1, 0.7],
   });
   const animate = (val: any) => {
      Animated.spring(_animation, {
         toValue: val,
         bounciness: 0,
         useNativeDriver: true,
      }).start();
   };

   return (
      <View
         style={[props.style, styles.inputContainer, {
            borderColor: props.borderError ? Colors.red : onClickInput == true ? Colors.bluePrimary : '#D0D0D0',
            height: heightInput,
         }]
         }
         onLayout={e => {

            !inputHeight && setInputHeight(e.nativeEvent.layout.height)
         }}
      >
         <View style={{ height: heightInput / heightText, ...styles.placeholderContainer }}>
            <Animated.Text
               style={[
                  styles.placeholder, { color: onClickInput == true ? Colors.bluePrimary : (props.editable === false ? "#D0D0D0" : Colors.placeholderTextColor) },
                  { transform: [{ translateY }, { translateX }, { scale }] },
               ]}
               onTextLayout={e =>
                  !placeholderWidth && setWidth(e.nativeEvent.lines[0]?.width || 0)
               }
            >
               {props.placeholder}
               <Text style={{ color: onClickInput == true || props.showRequired ? 'red' : '#D0D0D0' }}>
                  {props.required == true ? " *" : null}
               </Text>
            </Animated.Text>
         </View>
         <TextInput
            ref={props.ref}
            style={[
               styles.input,
               props.multiline,
               { paddingRight: props.paddingRight ? 50 : 13 },
               { color: props.editable === false ? "#D0D0D0" : Colors.textBody },
               { color: props.textColor ? props.textColor : props.editable === false ? "#D0D0D0" : Colors.textBody }
            ]}
            value={props?.value}
            returnKeyType={props.returnKeyType}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={props.maxLength}
            secureTextEntry={props.secureTextEntry}
            keyboardType={props.keyboardType}
            onChangeText={props.onChange}
            multiline={props.multiline}
            autoCapitalize={props.autoCapitalize}
            autoCorrect={props.autoCorrect}
            clearTextOnFocus={props.clearTextOnFocus}
            // autoCompleteType={props.autoCompleteType}
            editable={props.editable}
            blurOnSubmit={props.blurOnSubmit}
            autoFocus={props.autoFocus}
            textAlignVertical={props.textAlignVertical}
            selectionColor={Colors.bluePrimary}
         />
         {
            props.svgIcon ?
               <View style={styles.viewIcon}>
                  <SvgXml xml={props.svgIcon} width={30} height={30} />
               </View>
               : null
         }

      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      padding: 20,
      width: '100%'
   },
   inputContainer: {
      borderWidth: 1,
      height: 55,
      borderRadius: 4,
      justifyContent: 'center',
   },
   input: {
      paddingHorizontal: 13,
      fontSize: 18,
      height: '100%',
   },
   placeholderContainer: {
      position: 'absolute',
      backgroundColor: 'red',
      justifyContent: 'center',
   },
   placeholder: {
      fontSize: 18,
      position: 'absolute',
      marginHorizontal: 5,
      paddingHorizontal: 6,
      backgroundColor: '#fff',
      borderRadius: 4,
      top: "4%"
   },
   viewIcon: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: 15
   }
});
