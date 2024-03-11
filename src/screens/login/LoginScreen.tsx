import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import { serverUrl } from '../../services/CloudServices';
import { NavigationConstants } from '../../navigation/NavigationConstants';
import { Colors } from '../../utils/Colors';
import { SvgXml } from 'react-native-svg';
import { iconEye, iconOffEye } from './svg';

interface LoginProps {
    navigation: any
}

const LoginScreen = (props: LoginProps) => {

    const { navigation } = props;

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [msgError, setMsgError] = useState('');
    const [isLoading, setLoading] = useState(false);

    const [isShowPassword, setShowPassword] = useState(false);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleLogin = async () => {
        setLoading(true)
        if (!userName && !password) {
            setMsgError('Vui lòng không bỏ trống')
            setLoading(false)
        }
        setMsgError('')
        dismissKeyboard()
        setLoading(false)

        try {
            const response = await axios.post(`${serverUrl}/login`, { userName, password })
            console.log("response data login", response.data.success);
            if (response.data.success) {
                navigation.navigate(NavigationConstants.ProfileScreen)
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    const handleShowPassword = () => {
        setShowPassword(!isShowPassword)
    }

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>

            <View style={styles.flexView}>
                {
                    !isLoading ? null :
                        <View style={styles.viewLoading}>
                            <ActivityIndicator size="large" color="blue" />
                        </View>
                }
                <View style={styles.viewLogin}>
                    <Text style={styles.titleScreen}>ĐĂNG NHẬP</Text>
                    <Text style={styles.contentInput}>Đăng nhập hệ thống</Text>
                    <View style={styles.viewInput}>
                        <TextInput
                            onChangeText={(text: string) => setUserName(text)}
                            placeholder='Username'
                            value={userName}
                        />

                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            onChangeText={(text: string) => setPassword(text)}
                            placeholder='Password'
                            value={password}
                            secureTextEntry={!isShowPassword}
                        />
                        <TouchableOpacity
                            style={styles.btnEye}
                            onPress={handleShowPassword}
                        >
                            <SvgXml xml={isShowPassword ? iconEye : iconOffEye} width={30} height={30} />
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.viewInput}>
                        <TextInput
                            onChangeText={(text: string) => setPassword(text)}
                            placeholder='Password'
                            value={password}
                        />

                    </View> */}
                    <View style={styles.btnView}>
                        <Text style={styles.TxtForgotPassword}>
                            Quên mật khẩu?
                        </Text>
                        <TouchableOpacity
                            style={styles.btnLogin}
                            onPress={handleLogin}
                        >
                            <Text style={styles.txtButton}>ĐĂNG NHẬP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.txtError}>{msgError}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    flexView: {
        flex: 1,
        paddingHorizontal: '6%',
        paddingTop: 120,
        backgroundColor: Colors.bgColor,
    },
    viewLogin: {
        width: '100%',
        height: 450,
        paddingVertical: '12%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: '6%'
    },
    titleScreen: {
        fontSize: 34,
        fontWeight: '700',
        textAlign: 'center',
        color: 'black'
    },
    contentInput: {
        fontSize: 16,
        marginTop: 40,

    },
    viewInput: {
        width: '100%',
        borderWidth: 1,
        marginTop: 24,
        borderColor: '#DFDFDF',
        paddingLeft: 20,
        paddingRight: 8,
        borderRadius: 4
    },
    btnView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 38,
    },
    TxtForgotPassword: {
        fontSize: 16,
        color: 'black',
        textDecorationLine: 'underline'
    },
    btnLogin: {
        width: '52%',
        height: 60,
        backgroundColor: '#E64E1D',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtButton: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    txtError: {
        fontSize: 16,
        color: 'red',
        marginTop: 20,
    },
    viewLoading: {
        position: 'absolute',
        alignSelf: 'center',
        top: 40
    },
    btnEye: {
        width: 50, height: 52,
        position: 'absolute',
        right: 10, bottom: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default LoginScreen