import pywinauto, time
from pywinauto.application import Application
from pywinauto.keyboard import send_keys
from pywinauto.controls.win32_controls import ComboBoxWrapper

app = Application()
app.start(cmd_line=r'"C:\Program Files (x86)\LaserGRBL\LaserGRBL.exe"')

time.sleep(2)

app['WindowsForms10.Window.8.app.0.62e449_r6_ad1'][u'ComboBox'].select('COM9')

app['WindowsForms10.Window.8.app.0.62e449_r6_ad1'][u'WindowsForms10.Window.8.app.0.62e449_r6_ad118'].click()

app['WindowsForms10.Window.8.app.0.62e449_r6_ad1'][u'BaudWindowsForms10.Window.8.app.0.62e449_r6_ad11'].click()

time.sleep(2)

# Connect Open
openWindow = app.window(title_re=u'Open')
openWindow[u'ComboBox'].click_input()
openWindow[u'ComboBox'].type_keys(r'C:\Users\Utilisateur\Desktop\idraw.gcode')
openWindow[u'&OpenButton'].click()

app['WindowsForms10.Window.8.app.0.62e449_r6_ad1'][u'BaudWindowsForms10.Window.8.app.0.62e449_r6_ad12'].click()

app['WindowsForms10.Window.8.app.0.62e449_r6_ad1'][u'BaudWindowsForms10.Window.8.app.0.62e449_r6_ad12'].click()



# C:\Users\Utilisateur\Desktop\idraw.gcode

# allo = app.LaserGRBL[u'LaserGRBL v4.9.4WindowsForms10.Window.8.app.0.62e449_r6_ad1'][u'WindowsForms10.Window.8.app.0.62e449_r6_ad12'][u'WindowsForms10.Window.8.app.0.62e449_r6_ad13'][u'WindowsForms10.Window.8.app.0.62e449_r6_ad14'][u'WindowsForms10.Window.8.app.0.62e449_r6_ad116'][u'WindowsForms10.Window.8.app.0.62e449_r6_ad117'].print_control_identifiers()

print('yo bro')

# 'WindowsForms10.Window.8.app.0.62e449_r6_ad12'
# 'WindowsForms10.Window.8.app.0.62e449_r6_ad13'
# 'WindowsForms10.Window.8.app.0.62e449_r6_ad14'
# 'WindowsForms10.Window.8.app.0.62e449_r6_ad116'
# 'WindowsForms10.Window.8.app.0.62e449_r6_ad117'
# 'WindowsForms10.Window.8.app.0.62e449_r6_ad118'