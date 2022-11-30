import pywinauto

pwa_app = pywinauto.application.Application().start(cmd_line=u'"C:\Program Files (x86)\LaserGRBL\LaserGRBL.exe"')
ctrl = pwa_app.window['Static2']
ctrl.ClickInput("Allo")