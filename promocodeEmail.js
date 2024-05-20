export const promocodeEmail = (username) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            width: 100%;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            padding: 0;
            margin: 0;
        }
        .es-wrapper-color {
            background-color: #FAFAFA;
        }
        .es-wrapper {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            background-repeat: repeat;
            background-position: center top;
            background-color: #FAFAFA;
        }
        .es-header,
        .es-content {
            width: 100%;
        }
        .es-header-body,
        .es-content-body {
            width: 600px;
            background-color: #FFFFFF;
        }
        .es-header-body {
            background-color: transparent;
        }
        .es-content-body {
            border-top: 10px solid #7957FF;
            border-bottom: 10px solid #7957FF;
        }
        .es-left,
        .es-right {
            float: left;
        }
        .es-table-not-adapt.es-social img {
            display: block;
            border: 0;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        .es-menu a {
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            mso-line-height-rule: exactly;
            text-decoration: none;
            display: block;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
            color: #666666;
            font-size: 14px;
        }
        .es-m-txt-c {
            text-align: center;
        }
        .es-m-txt-l {
            text-align: left;
        }
        .es-m-txt-l h3,
        .es-m-txt-c h3 {
            margin: 0;
            line-height: 24px;
            mso-line-height-rule: exactly;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
            font-size: 20px;
            font-weight: bold;
            color: #7957FF;
        }
        .es-m-txt-l p,
        .es-m-txt-c p {
            margin: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            mso-line-height-rule: exactly;
            font-family: arial, 'helvetica neue', helvetica, sans-serif;
            line-height: 21px;
            color: #333333;
            font-size: 14px;
        }
        .es-m-txt-l p strong,
        .es-m-txt-c p strong {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="es-wrapper-color">
        <table class="es-wrapper" cellspacing="0" cellpadding="0">
            <tr>
                <td valign="top">
                    <table class="es-header" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                            <td align="center">
                                <table class="es-header-body" cellspacing="0" cellpadding="0" align="center">
                                    <tr>
                                        <td align="left" style="padding: 10px 20px;">
                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td valign="top" align="center" style="width: 560px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tr>
                                                                <td align="center" style="padding: 20px 0;">
                                                                    <img src="https://i.imgur.com/kKfOFNL.png" alt="Logo" title="Logo" width="200" height="48" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <table class="es-menu" width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                                                        <tr class="links">
                                                                            <td width="50%" valign="top" align="center" style="padding: 15px 5px; border:0;">
                                                                                <a href="" style="font-family: arial, 'helvetica neue', helvetica, sans-serif; color:#666666; font-size:14px;">+357 22 761795</a>
                                                                            </td>
                                                                            <td width="50%" valign="top" align="center" style="padding: 15px 5px; border:0;">
                                                                                <a href="" style="font-family: arial, 'helvetica neue', helvetica, sans-serif; color:#666666; font-size:14px;">support@apatecyprusestate.com</a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                            <td align="center">
                                <table class="es-content-body" cellspacing="0" cellpadding="0" align="center">
                                    <tr>
                                        <td align="left" style="padding: 30px 20px 0;">
                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td valign="top" align="center" style="width: 560px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tr>
                                                                <td align="left">
                                                                    <p>${new Date().toLocaleDateString(
                                                                      "ru-RU"
                                                                    )}</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="left" style="padding: 20px 20px; background-image: url(https://i.imgur.com/4OM6MoB.png); background-repeat: no-repeat; background-position: center 80px;">
                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td valign="top" align="center" style="width: 560px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tr>
                                                                <td class="es-m-txt-l" style="padding: 5px 0 10px;">
                                                                    <h3>Здравствуйте ${username},</h3>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="es-m-txt-l" style="padding: 5px 0 10px;">
                                                                    <p>Коллектив <strong>Apate Cyprus Estate</strong> искренне поздравляет вас с достижением высоких результатов в номинации <strong>"Самая результативная структура"</strong>! Ваше лидерство и преданность принесли впечатляющие результаты, и ваше место в 20ке лидеров подтверждает ваши выдающиеся способности и усердие. </br></br>(Место вашей структуры в рейтинге - <strong>20</strong>).<br><br></p>
                                                                    <p>Оборот вашей структуры является примером эффективного и стратегического подхода к работе. Ваши достижения в этой области заслуживают наших наивысших похвал и признания!<br><br></p>
                                                                    <p style="background-color: rgba(121, 87, 255, 1); border-radius: 20px; padding: 25px; margin-bottom: 25px; color: #fff;">
                                                                        <strong><i>Хотим также поделиться важной информацией: попадание в 10ку лидеров в нашей компании гарантирует вам участие в нашей грядущей конференции, которая станет возможностью не только для обучения и обмена опытом, но и для укрепления связей с другими участниками нашего сообщества. Независимо от количества членов вашей структуры, ваше достижение будет отмечено и признано.</i></strong>
                                                                    </p>
                                                                    <p>Мы убеждены, что ваше лидерство и стремление к совершенству приведут вас к новым высотам успеха. Желаем вам дальнейших побед и достижений в вашей карьере вместе с Apate Cyprus Estate!<br><br></p>
                                                                    <p>Если у вас возникнут вопросы или вам потребуется помощь, пожалуйста, не стесняйтесь связаться с нами.<br><br>С уважением, </br><i>Customer Support Apate Cyprus Estate</i><br><br></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="es-m-txt-l" align="left" style="padding-bottom: 20px;">
                                                                    <img src="https://i.imgur.com/akww31j.png" alt="" height="95" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                            <td align="center">
                                <table class="es-content-body" cellspacing="0" cellpadding="0" align="center">
                                    <tr>
                                        <td align="left" style="padding: 20px;">
                                            <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                <tr>
                                                    <td align="left" style="width: 115px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tr>
                                                                <td align="right" style="padding: 5px 0; font-size:0;">
                                                                    <img src="https://i.imgur.com/aTE6evt.jpg" alt="" width="115" height="115" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table class="es-right" cellspacing="0" cellpadding="0" align="right">
                                                <tr>
                                                    <td align="left" style="width: 425px;">
                                                        <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                                            <tr>
                                                                <td class="es-m-txt-c" align="left">
                                                                    <h3 style="padding-top: 15px;">Customer Support</h3>
                                                                    <p><a href="tel:+35722761795">+357 22 761795</a></p>
                                                                    <p><a href="mailto:support@apatecyprusestate.com">support@apatecyprusestate.com</a></p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td class="es-m-txt-c" align="left" style="padding: 5px 0; font-size:0;">
                                                                    <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation">
                                                                        <tr>
                                                                            <td align="center" style="padding-right: 10px;">
                                                                                <a href="https://www.instagram.com/apatecyprusestate/">
                                                                                    <img title="Instagram" src="https://i.imgur.com/Xl0LvdX.png" alt="Inst" width="24" height="24">
                                                                                </a>
                                                                            </td>
                                                                            <td align="center" style="padding-right: 10px;">
                                                                                <a href="https://www.youtube.com/@apatecyprusestate">
                                                                                    <img title="Youtube" src="https://i.imgur.com/uGFx5YY.png" alt="Youtube" width="24" height="24">
                                                                                </a>
                                                                            </td>
                                                                            <td align="center">
                                                                                <a href="https://t.me/apatenews">
                                                                                    <img title="Telegram" src="https://i.imgur.com/dQfFsEj.png" alt="Telegram" width="24" height="24">
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            <!--[if mso]>
                                            <table cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width:20px"></td>
                                                    <td style="width:425px" valign="top">
                                                    <![endif]-->
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;
};
