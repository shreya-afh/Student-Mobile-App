package com.infosys.afh.student;

import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleEdgeToEdge();
    }

    private void handleEdgeToEdge() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
            ViewCompat.setOnApplyWindowInsetsListener(
                getBridge().getWebView(),
                (v, windowInsets) -> {
                    Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
                    ViewGroup.MarginLayoutParams params = (ViewGroup.MarginLayoutParams) v.getLayoutParams();
                    params.topMargin = insets.top;
                    params.bottomMargin = insets.bottom;
                    params.leftMargin = insets.left;
                    params.rightMargin = insets.right;
                    v.setLayoutParams(params);
                    return WindowInsetsCompat.CONSUMED;
                }
            );
        }
    }
}
