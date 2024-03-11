import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard, Modal, FlatList, Dimensions, Image
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../../services/CloudServices';
import { Colors } from '../../utils/Colors';
import TTextInput from '../../components/TTextInput';
import { SvgXml } from 'react-native-svg';
import { iconCheck, iconClose, iconDown, iconEye, iconOffEye, iconUnCheck } from './svg';
import DatePicker from 'react-native-date-picker';
import { ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import { profileUser } from './type';

const ProfileScreen = () => {
    const [profileUser, setProfileUser] = useState<profileUser>();
    const [sexs, setSexs] = useState([{ sex: "Nam", isSelected: true }, { sex: "Nữ", isSelected: false }])

    const [isSelectTime, setSelectTime] = useState<boolean>(false)
    const currentDate = new Date();
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [typePicker, setTypePicker] = useState('');

    const [password, setPassword] = useState({ pass: '', repass: '' });
    const [isShowPassword, setShowPassword] = useState(false);
    const [isShowRePassword, setShowRePassword] = useState(false);
    const [msgError, setMsgError] = useState('');
    const [imageUser, setImageUser] = useState('')

    const [isSelectLocation, setSelectLocation] = useState(false);
    const listLocation = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

    useEffect(() => {
        getProfileUser();
    }, [])

    const getProfileUser = async () => {
        try {
            const response = await axios.get(`${serverUrl}/profile/${"1"}`)
            console.log("response data login", response.data.user);
            if (response.data) {
                setProfileUser(response.data.user);
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleSelectSex = (index: number) => {
        const updatedSexs = sexs.map((item, i) => ({
            ...item,
            isSelected: i === index
        }));

        setProfileUser({ ...profileUser, sex: sexs[index].sex })
        setSexs(updatedSexs);
    }

    const onChangeInput = (text: string, keyName: string) => {
        setProfileUser({ ...profileUser, [keyName]: text })
    }

    const handleDateSelected = (date: Date) => {
        setSelectTime(false);
        const newDate = formatDate(date);
        setProfileUser({ ...profileUser, [typePicker]: newDate.toString() })
        setTypePicker('')
    }

    const handleDatePickerCanceled = () => {
        setSelectTime(false)
    }

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;

        return formattedDate;
    };


    const showDateTimePicker = (action: string) => {
        setSelectTime(true)

        setTypePicker(action)
    }

    const handleUpdateProfile = async () => {

        if (msgError !== '') {
            return
        }

        try {
            const response = await axios.put(`${serverUrl}/update-user`, profileUser);
            console.log(response.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const getFaceImageFromGallery = () => {
        let options: ImageLibraryOptions = {
            mediaType: 'photo',
            maxWidth: 640,
            maxHeight: 480,
            quality: 1,
            includeBase64: true,
            includeExtra: true
        };
        console.log('Chose Image');
        launchImageLibrary(options, async (response: any) => {
            setImageUser(response?.assets[0].base64)
        });
    }

    const handleShowPassword = (type: string) => {
        switch (type) {
            case 'pass':
                setShowPassword(!isShowPassword)
                break;

            case 'repass':
                setShowRePassword(!isShowRePassword)
                break;

            default:
                break;
        }
    }

    const onChangePassword = ((value: string, typePass: string) => {
        setPassword({ ...password, [typePass]: value })
        if (password.pass !== value) {
            setMsgError('Mật khẩu không trùng khớp')
        } else {
            setMsgError('')
            setProfileUser({ ...profileUser, password: value })
        }
    })

    const handleSelectLocation = (item: string) => {
        setProfileUser({ ...profileUser, location: item })
        setSelectLocation(false)
    }

    const renderItemLocation = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                key={item}
                onPress={() => handleSelectLocation(item)}
                style={styles.viewItemModal}>
                <Text style={styles.txtItemModal}>{item}</Text>
            </TouchableOpacity>
        )
    }

    const modalSelectLocation = useMemo(() => {
        return (
            <Modal
                transparent={true}
                visible={isSelectLocation}
                animationType='fade'
            >
                <View style={styles.transparentView}>
                    <View style={styles.modalContainer}>
                        <View style={styles.headerModal}>
                            <Text style={styles.txtHeaderModal} >Chọn vị trí</Text>
                            <TouchableOpacity
                                style={styles.btnClose}
                                onPress={() => setSelectLocation(false)}
                            >
                                <SvgXml xml={iconClose} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contentModal}>
                            <FlatList
                                data={listLocation}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item) => item}
                                renderItem={renderItemLocation}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }, [isSelectLocation]);

    return (
        <View style={styles.flexView}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View>
                        <View style={styles.viewPersonalInfo}>
                            <Text style={styles.titleScreen}>Cập nhật profile</Text>
                            <Text style={styles.titleInfo}>Thông tin cá nhân</Text>
                            <View style={styles.viewLine}></View>
                            <View style={styles.viewImage}>
                                <Text style={styles.label}>Photo: </Text>
                                <TouchableOpacity
                                    onPress={getFaceImageFromGallery}
                                    style={{ width: '60%', height: 110, borderWidth: 1 }}>
                                    {
                                        imageUser !== '' ?
                                            <Image
                                                style={{ width: '100%', height: '100%', borderRadius: 20 }}
                                                source={{
                                                    uri: `data:image/jpeg;base64,${imageUser}`,
                                                }} />
                                            : null
                                    }
                                </TouchableOpacity>
                            </View>

                            <View style={styles.viewItemUser}>
                                <TTextInput
                                    clearTextOnFocus={false}
                                    value={profileUser?.name}
                                    autoCorrect={false}
                                    style={styles.input}
                                    onChange={(text: string) => onChangeInput(text, 'name')}
                                    secureTextEntry={false}
                                    placeholder={'Tên nhân viên'} />

                                <TTextInput
                                    clearTextOnFocus={false}
                                    value={profileUser?.id?.toString()}
                                    autoCorrect={false}
                                    style={styles.input}
                                    keyboardType={'number-pad'}
                                    onChange={(text: string) => onChangeInput(text, 'id')}
                                    secureTextEntry={false}
                                    placeholder={'Mã nhân viên'} />

                                <TouchableOpacity
                                    onPress={() => setSelectLocation(true)}
                                >
                                    <TTextInput
                                        clearTextOnFocus={false}
                                        value={profileUser?.location}
                                        autoCorrect={false}
                                        style={styles.input}
                                        editable={false}
                                        onChange={(text: string) => onChangeInput(text, 'location')}
                                        secureTextEntry={false}
                                        placeholder={'Vị trí'}
                                        svgIcon={iconDown} />
                                </TouchableOpacity>

                                <View style={styles.viewCheckBoxSex}>
                                    <Text>Giới tính</Text>
                                    <View style={styles.checkBoxSex}>
                                        {sexs.map((item: any, index: number) => (
                                            <TouchableOpacity
                                                onPress={() => handleSelectSex(index)}
                                                style={styles.btnSelectSex}
                                                key={item.sex}>
                                                <Text style={styles.itemSex}
                                                >{item.sex}</Text>
                                                <SvgXml xml={item.isSelected ? iconCheck : iconUnCheck} />

                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => showDateTimePicker('birthDay')}
                                >
                                    <TTextInput
                                        clearTextOnFocus={false}
                                        autoCorrect={false}
                                        style={styles.input}
                                        onChange={undefined}
                                        value={profileUser?.birthDay}
                                        secureTextEntry={false}
                                        editable={false}
                                        placeholder={'Ngày sinh'}
                                        svgIcon={iconDown} />
                                </TouchableOpacity>

                                <TTextInput
                                    clearTextOnFocus={false}
                                    autoCorrect={false}
                                    style={styles.input}
                                    onChange={(text: string) => onChangeInput(text, 'cmnd')}
                                    value={profileUser?.cmnd}
                                    secureTextEntry={false}
                                    keyboardType={'number-pad'}
                                    placeholder={'Số CMND/CCCD'} />

                                <TTextInput
                                    clearTextOnFocus={false}
                                    autoCorrect={false}
                                    style={styles.input}
                                    onChange={(text: string) => onChangeInput(text, 'email')}
                                    value={profileUser?.email}
                                    keyboardType={'email-address'}
                                    secureTextEntry={false}
                                    placeholder={'Email'} />

                                <TouchableOpacity
                                    onPress={() => showDateTimePicker('dateRange')}
                                >
                                    <TTextInput
                                        clearTextOnFocus={false}
                                        autoCorrect={false}
                                        style={styles.input}
                                        onChange={undefined}
                                        editable={false}
                                        value={profileUser?.dateRange}
                                        secureTextEntry={false}
                                        placeholder={'Ngày cấp'}
                                        svgIcon={iconDown} />
                                </TouchableOpacity>

                                <TTextInput
                                    clearTextOnFocus={false}
                                    autoCorrect={false}
                                    style={styles.input}
                                    onChange={(text: string) => onChangeInput(text, 'phone')}
                                    value={profileUser?.phone}
                                    secureTextEntry={false}
                                    keyboardType={'number-pad'}
                                    placeholder={'Số điện thoại'} />

                                <TTextInput
                                    clearTextOnFocus={false}
                                    autoCorrect={false}
                                    style={styles.input}
                                    onChange={(text: string) => onChangeInput(text, 'locationRange')}
                                    value={profileUser?.locationRange}
                                    secureTextEntry={false}
                                    placeholder={'Nơi cấp'} />

                            </View>
                        </View>

                        <Text style={styles.titleInfo}>Thông tin đăng nhập</Text>
                        <View style={styles.viewLine} />

                        <TTextInput
                            clearTextOnFocus={false}
                            autoCorrect={false}
                            style={styles.input}
                            onChange={(text: string) => onChangeInput(text, 'username')}
                            value={profileUser?.username}
                            secureTextEntry={false}
                            placeholder={'Tên đăng nhập'} />


                        <View>
                            <TTextInput
                                clearTextOnFocus={false}
                                autoCorrect={false}
                                style={styles.input}
                                onChange={(text: string) => onChangePassword(text, 'pass')}
                                secureTextEntry={!isShowPassword}
                                value={password.pass}
                                placeholder={'Mật khẩu'} />
                            <TouchableOpacity
                                style={styles.btnEye}
                                onPress={() => handleShowPassword('pass')}
                            >
                                <SvgXml xml={isShowPassword ? iconEye : iconOffEye} width={30} height={30} />
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TTextInput
                                clearTextOnFocus={false}
                                value={password.repass}
                                autoCorrect={false}
                                style={[styles.input]}
                                onChange={(text: string) => onChangePassword(text, 'repass')}
                                secureTextEntry={!isShowRePassword}
                                placeholder={'Xác nhận mật khẩu'} />
                            <TouchableOpacity
                                style={styles.btnEye}
                                onPress={() => handleShowPassword('repass')}
                            >
                                <SvgXml xml={isShowRePassword ? iconEye : iconOffEye} width={30} height={30} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.txtError}>{msgError}</Text>

                        <TouchableOpacity
                            style={styles.btnUpdate}
                            onPress={handleUpdateProfile}
                        >
                            <Text style={styles.txtUpdate}>Cập nhật</Text>
                        </TouchableOpacity>

                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>

            {
                isSelectTime ?
                    <DatePicker
                        modal={true}
                        mode={'date'}
                        title={'Chọn thời gian'}
                        open={true}
                        locale={'vi'}
                        date={selectedDate}
                        textColor={"black"}
                        onConfirm={handleDateSelected}
                        onCancel={handleDatePickerCanceled}
                        minuteInterval={15}
                        onDateChange={value => { }}
                        confirmText={'Xác nhận'}
                        cancelText={'Huỷ'}
                    />
                    : null
            }
            {modalSelectLocation}
        </View>
    )
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    flexView: {
        flex: 1,
        paddingHorizontal: '6%',
        backgroundColor: Colors.white
    },
    titleScreen: {
        fontSize: 26,
        color: Colors.bgBtn
    },
    viewPersonalInfo: {
        flex: 3,
    },
    viewLoginInfo: {
        flex: 1,
    },
    titleInfo: {
        fontSize: 20,
        color: 'black',
        marginTop: 20,
    },
    viewLine: {
        width: '100%',
        height: 1,
        backgroundColor: 'black',
        marginTop: 4, marginBottom: 20,
    },
    viewItemUser: {
        width: '100%',
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        width: '30%',
        color: Colors.label,
    },
    viewImage: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10
    },
    touchableLable: {
        width: '70%',
        paddingVertical: 10,
        borderWidth: 1
    },
    viewCheckBoxSex: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        marginTop: 16,
        marginVertical: 10,
        flexDirection: 'row'
    },
    checkBoxSex: {
        borderWidth: 1,
        width: '80%',
        height: '100%',
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingRight: 40,
        flexDirection: 'row',
        borderColor: '#D0D0D0'
    },
    input: {
        marginTop: 20
    },
    btnUpdate: {
        width: '55%',
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginBottom: 80,
        alignSelf: 'center',
        backgroundColor: "#3D7EE3"
    },
    txtUpdate: {
        fontSize: 22,
        color: Colors.white
    },
    btnEye: {
        width: 50, height: 52,
        position: 'absolute',
        right: 10, bottom: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtError: {
        color: 'red',
        fontSize: 16,
        marginBottom: 50,
        marginTop: 10
    },
    itemSex: {
        marginRight: 10,
        fontSize: 16
    },
    btnSelectSex: {
        flexDirection: 'row',
        marginLeft: 20
    },
    transparentView: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        flex: 1,
        justifyContent: 'flex-end'
    },
    modalContainer: {
        height: 400, width: '100%',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    headerModal: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    txtHeaderModal: {
        fontSize: 24,
        color: 'black',
        fontWeight: '500'
    },
    btnClose: {
        width: 45,
        height: 45,
        padding: 5,
        position: 'absolute',
        right: 20,
        top: 6
    },
    contentModal: {
        width: '100%',
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewItemModal: {
        width: screenWidth - 32,
        height: 40,
        marginTop: 10,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.placeholderTextColor
    },
    txtItemModal: {
        fontSize: 18,
        color: 'black'
    }
});

export default ProfileScreen